/**
 * Internal Block Libraries
 */
const { 
	apiFetch, 
	apiRequest,
} = wp;
const { registerStore } = wp.data;

/**
 * Actions
 */
const actions = {
	setOption( option ) {
		return {
			type: 'SET_OPTION',
			option,
		};
	},
	receiveOption( path ) {
		return {
			type: 'RECEIVE_OPTION',
			path,
		};
	},
	updateOption( option ) {
		return {
			type: 'UPDATE_OPTION',
			option,
		};
	},
};

/**
 * Register Store
 */
const store = registerStore( 'matt-watson/login-block', {
	reducer( state = { option: {} }, action ) {

		switch ( action.type ) {
			case 'SET_OPTION':
				return {
					...state,
					option: action.option,
				};
			case 'UPDATE_OPTION':
				return {
					...state,
					option: action.option,
				};
		}

		return state;
	},

	actions,

	selectors: {
		receiveOption( state, item ) {
			const { option } = state;
			return option;
		},
	},

	controls: {
		RECEIVE_OPTION( action ) {
			return apiFetch( { path: action.path } );
		},
	},

	resolvers: {
		* receiveOption( item ) {
			const option = yield actions.receiveOption( '/matt-watson/secure-blocks/v1/get/option/' + item + '/' );
			return actions.setOption( option );
		},
	},
} );

export default store;