import React from "react";
import { FormItem } from "..";

export type Permission = {
    type: PermissionType,
    value?: any,
    rule?: (event: React.KeyboardEvent) => boolean
}

export enum PermissionType {
    OnlyNumber,
    OnlyText,
    OnlyEmail,
    MaxLength,
    Custom
}

export const Permit = {
    OnlyNumber: (): Permission => {
        return {
            type: PermissionType.OnlyNumber
        }
    },
    OnlyText: (): Permission => {
        return {
            type: PermissionType.OnlyText
        }
    },
    OnlyEmail: (): Permission => {
        return {
            type: PermissionType.OnlyEmail
        }
    },
    MaxLength: (value: number): Permission => {
        return {
            type: PermissionType.MaxLength,
            value: value
        }
    },
    Custom: (rule: (event: React.KeyboardEvent) => boolean): Permission => {
        return {
            type: PermissionType.Custom,
            rule: rule
        }
    }
}

//TODO: Prevent autocomplete & paste on Permissions
export const permitKey = (event: React.KeyboardEvent, item?: FormItem) => {
    let isValid = true;

    if (item && item.permissions && item.permissions.length > 0) {
        item.permissions.forEach(permission => {
            if (permission.type === PermissionType.OnlyNumber) {
                isValid = allowOnlyNumber(event);
            }
            else if (permission.type === PermissionType.OnlyText) {
                isValid = allowOnlyText(event);
            }
            else if (permission.type === PermissionType.OnlyEmail) {
                isValid = allowOnlyEmail(event);
            }
            else if (permission.type === PermissionType.MaxLength && permission.value && item.value.length >= permission.value) {
                const target = event.target as HTMLInputElement;

                if (target.selectionStart == target.selectionEnd) {
                    event.preventDefault();
                    isValid = false;
                }
            }
            else if (permission.type === PermissionType.Custom && permission.rule) {
                isValid = permission.rule(event);

                if (!isValid) {
                    event.preventDefault();
                }
            }
        });
    }

    return isValid;
}

const allowOnlyNumber = (event: React.KeyboardEvent) => {
    if ("0123456789".indexOf(event.key) === -1) {
        event.preventDefault();
        return false;
    }

    return true;
}

const allowOnlyText = (event: React.KeyboardEvent) => {
    if (!(/^[a-zA-ZşŞçÇğĞüÜöÖıİ ]+$/.test(event.key))) {
        event.preventDefault();
        return false;
    }

    return true;
}

const allowOnlyEmail = (event: React.KeyboardEvent) => {
    if (!(/[a-zA-Z0-9@._-]/g.test(event.key))) {
        event.preventDefault();
        return false;
    }

    return true;
}