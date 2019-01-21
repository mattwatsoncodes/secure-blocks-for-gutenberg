/**
 * Internal Block Libraries
 */
const { apiFetch }      = wp;
const { registerStore } = wp.data;

/**
 * Actions
 */
const actions = {
	setUserRoles( userRoles ) {
		return {
			type: 'SET_USER_ROLES',
			userRoles,
		};
	},
	receiveUserRoles( path ) {
		return {
			type: 'RECEIVE_USER_ROLES',
			path,
		};
	},
};

/**
 * Register Store
 */
const store = registerStore( 'matt-watson/secure-block', {
	reducer( state = { userRoles: {} }, action ) {

		switch ( action.type ) {
			case 'SET_USER_ROLES':
				return {
					...state,
					userRoles: action.userRoles,
				};
		}

		return state;
	},

	actions,

	selectors: {
		receiveUserRoles( state ) {
			const { userRoles } = state;
			return userRoles;
		},
	},

	controls: {
		RECEIVE_USER_ROLES( action ) {
			return apiFetch( { path: action.path } );
		},
	},

	resolvers: {
		* receiveUserRoles( state ) {
			const userRoles = yield actions.receiveUserRoles( '/matt-watson/secure-blocks/v1/user-roles/' );
			return actions.setUserRoles( userRoles );
		},
	},
} );