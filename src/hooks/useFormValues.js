import React from "react";

const useFormValues = (defaultValues) => {
  const [formValues, setFormValues] = React.useState(defaultValues);

  const setValue = React.useCallback(
    (id, fieldValue) => {
      return setFormValues((formValues) => ({
        ...formValues,
        [id]: {
          ...formValues[id],
          touched: true,
          message: "",
          value: /^\d+(\.?\d+)/.test(fieldValue)
            ? parseFloat(fieldValue)
            : fieldValue,
        },
      }));
    },
    [setFormValues]
  );

  const setError = React.useCallback(
    (id, message) => {
      return setFormValues((formValues) => ({
        ...formValues,
        [id]: {
          ...formValues[id],
          touched: true,
          error: message,
        },
      }));
    },
    [setFormValues]
  );

  const setTouched = React.useCallback(
    (id, touched = true) => {
      return setFormValues((formValues) => ({
        ...formValues,
        [id]: {
          ...formValues[id],
          touched,
        },
      }));
    },
    [setFormValues]
  );

  const handleOnChange = React.useCallback(
    (e) => {
      const { value, id } = e.currentTarget;
      if (!value) {
        return setError(id, "error: value not found");
      }

      return setValue(id, value);
    },
    [setError, setValue]
  );

  const handleOnFocus = React.useCallback(
    (e) => {
      const { id } = e.currentTarget;
      return setTouched(id);
    },
    [setTouched]
  );

  const resetFormValues = React.useCallback(() => {
    return setFormValues(() => defaultValues);
  }, [setFormValues, defaultValues]);

  return {
    handleOnFocus,
    handleOnChange,
    formValues,
    setValue,
    setError,
    setTouched,
    resetFormValues,
  };
};

export default useFormValues;
