import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";



interface ScheduleTypeDropdownProps {
    value: string;
    setValue: (callback: ((prev: string) => string) | string) => void;
    open: boolean;
    setOpen: (callback: ((prev: boolean) => boolean) | boolean) => void;
    items: { label: string; value: string }[];
    setItems: (callback: ((prev: { label: string; value: string }[]) => { label: string; value: string }[]) | { label: string; value: string }[]) => void;
    disabled?: boolean;
}

export default function ScheduleTypeDropdown({
                                                 value, setValue, open, setOpen, items, setItems, disabled
                                             }: ScheduleTypeDropdownProps) {

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            listMode={"SCROLLVIEW"}
            placeholder="Select schedule type"
            style={{ borderColor: "#d1d5db", paddingHorizontal: 15, paddingVertical: 15,marginVertical:0}}
            textStyle={{ fontSize: 17, fontFamily: "Futura", fontWeight: "300" }}
            dropDownContainerStyle={{ borderColor: "#d1d5db" }}
            disabled={disabled}
        />
    );
}
