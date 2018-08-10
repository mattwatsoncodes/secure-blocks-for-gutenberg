#! /bin/bash
#
# Deploy script
#
# Deploy the plugin to your git repo, tag it and push it to the WordPress plugin
# repository via SVN, all in one go.
#
# Original script thanks to
# https://github.com/GaryJones/wordpress-plugin-git-flow-svn-deploy.

echo
echo "WordPress Deployment for Secure Blocks for Gutenberg ('secure-blocks-for-gutenberg')"
echo
echo "Let's collect some information first."
echo
echo "Default values are in brackets - just hit enter to accept them."
echo

# Set up some default values. Feel free to change these in your own script
CURRENTDIR=`pwd`
PLUGINSLUG="secure-blocks-for-gutenberg"
default_svnpath="/tmp/$PLUGINSLUG"
default_svnurl="https://plugins.svn.wordpress.org/$PLUGINSLUG"
default_svnuser="mwtsn"
default_plugindir="$CURRENTDIR"
default_mainfile="plugin.php"
MAINFILE="plugin.php"
SVNUSER="mwtsn"
SVNPATH="/tmp/$PLUGINSLUG"

# Get some user input
# Can't use the -i flag for read, since that doesn't work for bash 3
echo "1 - Remote SVN repository on WordPress.org."
printf "($default_svnurl): "
read -e input
input="${input%/}" # Strip trailing slash
SVNURL="${input:-$default_svnurl}" # Populate with default if empty
echo

echo "2 - Your local plugin root directory."
printf "($default_plugindir): "
read -e input
input="${input%/}" # Strip trailing slash
PLUGINDIR="${input:-$default_plugindir}" # Populate with default if empty
echo

echo "Here is all the data we have collected:"
echo
echo "Slug: $PLUGINSLUG"
echo "Temp checkout path: $SVNPATH"
echo "Remote SVN repo: $SVNURL"
echo "SVN username: $SVNUSER"
echo "Plugin directory: $PLUGINDIR"
echo "Main file: $MAINFILE"
echo

echo "OK to proceed?"
echo "y - proceed"
echo "n - abort"
echo "g - deploy to GitHub only"
read -e input
PROCEED="${input:-y}"
echo

# Allow user cancellation
if [ "$PROCEED" != "y" || "$PROCEED" != "g" ]; then echo "Aborting..."; exit 1; fi

# git config
GITPATH="$PLUGINDIR/" # this file should be in the base of your git repository

# Let's begin...
echo ".........................................."
echo
echo "Preparing to deploy WordPress plugin"
echo
echo ".........................................."
echo

# Check version in readme.txt is the same as plugin file after translating both to unix line breaks to work around grep's failure to identify mac line breaks
PLUGINVERSION=`grep "Version:" $GITPATH/$MAINFILE | awk -F' ' '{print $NF}' | tr -d '\r'`
echo "$MAINFILE version: $PLUGINVERSION"
READMEVERSION=`grep "^Stable tag:" $GITPATH/readme.txt | awk -F' ' '{print $NF}' | tr -d '\r'`
echo "readme.txt version: $READMEVERSION"

if [ "$READMEVERSION" = "trunk" ]; then
	echo "Version in readme.txt & $MAINFILE don't match, but Stable tag is trunk. Let's proceed..."
elif [ "$PLUGINVERSION" != "$READMEVERSION" ]; then
	echo "Version in readme.txt & $MAINFILE don't match. Exiting...."
	exit 1;
elif [ "$PLUGINVERSION" = "$READMEVERSION" ]; then
	echo "Versions match in readme.txt and $MAINFILE. Let's proceed..."
fi

if git show-ref --tags --quiet --verify -- "refs/tags/$PLUGINVERSION"
	then
		echo "Version $PLUGINVERSION already exists as git tag. Exiting....";
		exit 1;
	else
		echo "Git version does not exist. Let's proceed..."
fi

echo "Changing to $GITPATH"
cd $GITPATH

echo -e "Enter a commit message for this new version: \c"
read COMMITMSG

git add -A
git commit -m "$COMMITMSG"

echo "Tagging new version in git"
git tag -a "$PLUGINVERSION" -m "Tagging version $PLUGINVERSION"

echo "Pushing git master to origin, with tags"
git push origin master
git push origin master --tags

if [ "$PROCEED" != "y" ]; then echo "GitHub deploy complete, now aborting before we do the SVN deploy."; exit 1; fi

echo
echo "Creating local copy of SVN repo trunk ..."
svn checkout $SVNURL $SVNPATH --depth immediates
svn update --quiet $SVNPATH/trunk --set-depth infinity

echo "Ignoring GitHub specific files"
svn propset svn:ignore "Thumbs.db
.git
.gitignore" "$SVNPATH/trunk/"

echo "Exporting the HEAD of master from git to the trunk of SVN"
git checkout-index -a -f --prefix=$SVNPATH/trunk/

# If submodule exist, recursively check out their indexes
if [ -f ".gitmodules" ]
	then
		echo "Exporting the HEAD of each submodule from git to the trunk of SVN"
		git submodule init
		git submodule update
		git config -f .gitmodules --get-regexp '^submodule\..*\.path$' |
			while read path_key path
			do
				#url_key=$(echo $path_key | sed 's/\.path/.url/')
				#url=$(git config -f .gitmodules --get "$url_key")
				#git submodule add $url $path
				echo "This is the submodule path: $path"
				echo "The following line is the command to checkout the submodule."
				echo "git submodule foreach --recursive 'git checkout-index -a -f --prefix=$SVNPATH/trunk/$path/'"
				git submodule foreach --recursive 'git checkout-index -a -f --prefix=$SVNPATH/trunk/$path/'
			done
fi

# Support for the /assets folder on the .org repo.
echo "Moving assets"
# Make the directory if it doesn't already exist
mkdir -p $SVNPATH/assets/
mv $SVNPATH/trunk/assets/wp-org/* $SVNPATH/assets/
svn add --force $SVNPATH/assets/
svn delete --force $SVNPATH/trunk/assets/wp-org
# We dont want all of our toys in the SVN repo, so lets remove them:
echo "Deleting unwanted assets"
svn delete --force $SVNPATH/trunk/examples
svn delete --force $SVNPATH/trunk/tools
svn delete --force $SVNPATH/trunk/.DS_Store

echo "Changing directory to SVN and committing to trunk"
cd $SVNPATH/trunk/
# Delete all files that should not now be added.
svn status | grep -v "^.[ \t]*\..*" | grep "^\!" | awk '{print $2}' | xargs svn del
# Add all new files that are not set to be ignored
svn status | grep -v "^.[ \t]*\..*" | grep "^?" | awk '{print $2}' | xargs svn add
svn commit --username=$SVNUSER -m "Preparing for $PLUGINVERSION release"

echo "Updating WordPress plugin repo assets and committing"
cd $SVNPATH/assets/
# Delete all new files that are not set to be ignored
svn status | grep -v "^.[ \t]*\..*" | grep "^\!" | awk '{print $2}' | xargs svn del
# Add all new files that are not set to be ignored
svn status | grep -v "^.[ \t]*\..*" | grep "^?" | awk '{print $2}' | xargs svn add
svn update --accept mine-full $SVNPATH/assets/*
svn commit --username=$SVNUSER -m "Updating assets"

echo "Creating new SVN tag and committing it"
cd $SVNPATH
svn update --quiet $SVNPATH/tags/$PLUGINVERSION
svn copy --quiet trunk/ tags/$PLUGINVERSION/
# Remove assets and trunk directories from tag directory
svn delete --force --quiet $SVNPATH/tags/$PLUGINVERSION/assets/wp-org
svn delete --force --quiet $SVNPATH/tags/$PLUGINVERSION/trunk
cd $SVNPATH/tags/$PLUGINVERSION
svn commit --username=$SVNUSER -m "Tagging version $PLUGINVERSION"

echo "Removing temporary directory $SVNPATH"
cd $SVNPATH
cd ..
rm -fr $SVNPATH/

echo "Commit complete!"
