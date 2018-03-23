import React from 'react';


class AutocompleteInput extends React.Component {
  state = {
    isFocus: false,
  }

  handleOnChange = (e) => {
    const { onChange } = this.props;
    console.log('&&&&& on change bind this event: ', e);
    onChange(e);
  }

  render() {
    const {
      onChange,
      InputComponent,
      inputRef,
    } = this.props;
    const { isFocus } = this.state;
    // console.log('&&& AutocompleteInput props: ', this.props);
    // console.log('&&& AutocompleteInput isFocus: ', isFocus);
    // console.log('&&& AutocompleteInput InputComponent props: ', this.props.InputComponent.props);
    return (
      <div>

        {/* <InputComponent {...this.props.InputComponent.props} /> */}
        <input
          ref={inputRef}
          {...this.props.InputComponent.props}
          onChange={this.handleOnChange}
        />
        {/* {this.props.InputComponent} */}
      </div>
      // <input
      //   ref={ref => this.props.getInputRef(ref)}
      //   id={id}
      //   name={id}
      //   type="text"
      //   value={value || ''}
      //   onChange={this.handleChange}
      //   onFocus={this.handleFocus}
      //   onBlur={this.handleBlur}
      // />
    );
  }
}

export default AutocompleteInput;
