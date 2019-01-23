/**
 * Internal Block Libraries
 */
const {
	PanelBody,
    PanelRow,
    ToggleControl,
} = wp.components;
const { InspectorControls } = wp.editor;
const { Component }         = wp.element;
const { __ }                = wp.i18n;

/**
 * Register Component
 */
export default class Inspector extends Component {

    render() {
        
        const {
            attributes: {
                userNameType
            },
            setAttributes,
            hasRegistration,
            handleHasRegistrationChange,
        } = this.props;
        
        const handleUserNameTypeChange = ( userNameType ) => { setAttributes( { userNameType } ) };
        const userNameTypes            = [
            { label: 'Both', value: 'both' },
            { label: 'Username', value: 'username' },
            { label: 'Email Address', value: 'email' },
        ];
            
        return (
            <InspectorControls>
                <PanelBody title={ __( 'Login Settings', 'secure-blocks-for-gutenberg' ) } className="login-block-inspector">
                    <PanelRow>
                        <SelectControl
                            label={ __( 'Allowed Login Method', 'secure-blocks-for-gutenberg' ) }
                            className="secure-block-inspector__control"
                            name="login-block-user-type"
                            value={ userNameType }
                            options={ userNameTypes }
                            onChange={ handleUserNameTypeChange }
                            help= { __( 'Allows users to login with only their email address, only their username, or allows them to use either.', 'secure-blocks-for-gutenberg' ) }
                        />
                    </PanelRow>
                </PanelBody>
                <PanelBody title={ __( 'Registration Settings', 'secure-blocks-for-gutenberg' ) } className="login-block-inspector">
                    <PanelRow>
                        <ToggleControl
                            label={ __( 'Anyone can register', 'secure-blocks-for-gutenberg' ) }
                            checked={ true == hasRegistration }
                            onChange={ ( value ) => { handleHasRegistrationChange( value ); } }
                            help= { __( 'Changes the global site settings for registration options, as can be found in Settings > General.', 'secure-blocks-for-gutenberg' ) }
                        />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        )
    }
}