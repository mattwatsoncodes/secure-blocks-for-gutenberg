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
                userNameType
            },
            setAttributes,
        } = this.props;
        
        const handleUserNameTypeChange = ( userNameType ) => { setAttributes( { userNameType } ) };
        const userNameTypes            = [
            { label: 'Both', value: 'both' },
            { label: 'Username', value: 'username' },
            { label: 'Email Address', value: 'email' },
        ];
            
        return (
            <InspectorControls>
                <PanelBody title={ __( 'Allowed Login Method', 'secure-blocks-for-gutenberg' ) } className="login-block-inspector">
                    <PanelRow>
                        <label for="login-block-user-type" class="login-block-inspector__label">
                            { __( 'Are users allowed to login with only their email address, username, or both?', 'secure-blocks-for-gutenberg' ) }
                        </label>
                    </PanelRow>
                    <PanelRow>
                    <SelectControl
                        className="secure-block-inspector__control"
                        name="login-block-user-type"
                        value={ userNameType }
                        options={ userNameTypes }
                        onChange={ handleUserNameTypeChange }
                    />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
        )
    }
}