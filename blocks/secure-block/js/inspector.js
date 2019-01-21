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
                        <label htmlFor="secure-block-roles" className="secure-block-inspector__label">
                            { __( 'Secure content is presented to users that are logged-in and in the following roles:', 'secure-blocks-for-gutenberg' ) }
                        </label>
                    </PanelRow>
                    <PanelRow>
                        <Select
                            className="secure-block-inspector__control"
                            name='secure-block-roles'
                            value={ selectedRoles }
                            onChange={ handleRoleChange }
                            options={ userRoles }
                            isMulti='true'
                            />
                    </PanelRow>
                    <PanelRow>
                        <em className="muted">{ __( 'No selected roles mean that secure content will be presented to all logged-in users.', 'secure-blocks-for-gutenberg' ) }</em>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        )
    }
}