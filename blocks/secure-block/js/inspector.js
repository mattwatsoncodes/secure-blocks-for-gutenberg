/**
 * Block Dependencies
 */
import Select from 'react-select';

/**
 * Internal Block Libraries
 */
const {
	PanelBody,
	PanelRow,
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
                role
            },
            setAttributes,
            userRoles,
        } = this.props;

        let selectedRoles = [];
        if ( null !== role ) {
            selectedRoles = JSON.parse( role );
        }
        
        const handleRoleChange = ( role ) => setAttributes( { role: JSON.stringify( role ) } );
            
        return (
            <InspectorControls>
                <PanelBody title={ __( 'Select Roles', 'secure-blocks-for-gutenberg' ) } className="secure-block-inspector">
                    <PanelRow>
                        <div class="components-base-control">
                            <div class="components-base-control__field">
                                <label htmlFor="secure-block-roles" className="secure-block-inspector__label components-base-control__label">
                                { __( 'User Roles', 'secure-blocks-for-gutenberg' ) }
                                </label>
                                <Select
                                    className="secure-block-inspector__control components-base-control__input"
                                    name='secure-block-roles'
                                    value={ selectedRoles }
                                    onChange={ handleRoleChange }
                                    options={ userRoles }
                                    isMulti='true'
                                />
                            </div>
                            <div class="components-base-control__help">
                                <p>{ __( 'Secure content is presented to users that are logged-in and in the selected roles.', 'secure-blocks-for-gutenberg' ) }</p>
                                <p>{ __( 'No selected roles mean that secure content will be presented to all logged-in users.', 'secure-blocks-for-gutenberg' ) }</p> 
                            </div>
                        </div>      
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        )
    }
}