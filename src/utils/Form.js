import React from "react";

class FormComponent extends React.Component<{}, State> {

    handleChangeEvent = (event: Event) => {
        const target = event.target;
        const name = target.id;

        if (target instanceof HTMLInputElement) {
            this.setState (prevState => ({
                pristine: {
                    ...prevState.pristine,
                    [name]: false
                },
                [name]: target.value
            }));
        }
    };

}

export default FormComponent;