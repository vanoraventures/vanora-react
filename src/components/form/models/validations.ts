import { FormItem } from ".."

export type Validation = {
    type: ValidationType,
    value?: any,
    message?: string | JSX.Element,
    isValid?: boolean,
    rule?: (value: any) => boolean
}

export enum ValidationType {
    Required,
    OptionalRequired,
    Email,
    Tckn,
    MinLength,
    MaxLength,
    ExactLength,
    SameWith,
    Custom
}

export const Validate = {
    Required: (message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.Required,
            message: message
        }
    },
    OptionalRequired: (items: string[], message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.OptionalRequired,
            value: items,
            message: message
        }
    },
    Email: (message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.Email,
            message: message
        }
    },
    Tckn: (message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.Tckn,
            message: message
        }
    },
    MinLength: (value: any, message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.MinLength,
            value: value,
            message: message
        }
    },
    MaxLength: (value: any, message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.MaxLength,
            value: value,
            message: message
        }
    },
    ExactLength: (value: any, message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.ExactLength,
            value: value,
            message: message
        }
    },
    SameWith: (value: any, message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.SameWith,
            value: value,
            message: message
        }
    },
    Custom: (rule: (value: any) => boolean, message?: string | JSX.Element): Validation => {
        return {
            type: ValidationType.Custom,
            rule: rule,
            message: message
        }
    }
}

export const validateFormItem = (item: FormItem, items: FormItem[]) => {
    item.isValid = true;

    if (item.validations) {
        item.validations.forEach((validation, index) => {
            validation.isValid = true;

            if (validation.type === ValidationType.Required) {
                if (item.value.length === 0) {
                    validation.isValid = false;
                }
            }
            if (validation.type === ValidationType.OptionalRequired) {
                const optionalRequriredItems = items.filter(x => validation.value.indexOf(x.name) != -1 || x.name == item.name);
                const isValid = !optionalRequriredItems.every(x => x.value.length === 0);

                optionalRequriredItems.forEach(x => {
                    const optionalRequriredItemValidation = x.validations?.find(y => y.type == ValidationType.OptionalRequired);

                    if (optionalRequriredItemValidation) {
                        optionalRequriredItemValidation.isValid = isValid;
                    }

                    x.isValid = x.validations?.every(y => y.isValid);
                });
            }
            if (validation.type === ValidationType.Email) {
                if (item.value.length > 0 && !(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(item.value))) {
                    validation.isValid = false;
                }
            }
            if (validation.type === ValidationType.Tckn) {
                if (item.value.length > 0) {
                    var isEleven = /^[0-9]{11}$/.test(item.value);
                    var totalX = 0;
                    var totalY1 = 0;
                    var totalY2 = 0;

                    for (var i = 0; i < 10; i++) {
                        totalX += Number(item.value.substr(i, 1));
                    }
                    for (var i = 0; i < 10; i += 2) {
                        totalY1 += Number(item.value.substr(i, 1));
                    }
                    for (var i = 1; i < 10; i += 2) {
                        totalY2 += Number(item.value.substr(i, 1));
                    }

                    var isRuleX = totalX % 10 == Number(item.value.substr(10, 1));
                    var isRuleY = ((totalY1 * 7) - totalY2) % 10 == Number(item.value.substr(9, 0));

                    validation.isValid = isEleven && isRuleX && isRuleY;
                }
            }
            if (validation.type === ValidationType.MinLength) {
                if (item.value.length < validation.value) {
                    validation.isValid = false;
                }
            }
            if (validation.type === ValidationType.MaxLength) {
                if (item.value.length > validation.value) {
                    validation.isValid = false;
                }
            }
            if (validation.type === ValidationType.ExactLength) {
                if (item.value.length !== validation.value) {
                    validation.isValid = false;
                }
            }
            if (validation.type === ValidationType.SameWith) {
                let sameWithValue = items.find(x => x.name === item.validations?.find(x => x.type === ValidationType.SameWith)?.value)?.value;

                if (item.value !== sameWithValue) {
                    validation.isValid = false;
                }
            }
            if (validation.type === ValidationType.Custom) {
                if (validation.rule && !validation.rule(item.value)) {
                    validation.isValid = false;
                }
            }
        });

        if (item.validations.some(x => x.isValid === false)) {
            item.isValid = false;
        }
    }
}