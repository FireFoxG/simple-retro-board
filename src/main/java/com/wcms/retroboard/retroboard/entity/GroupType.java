package com.wcms.retroboard.retroboard.entity;

public enum GroupType {
    POSITIVE("positive"),
    NEGATIVE("negative");

    String name;

    GroupType(String name) {
        this.name = name;
    }

    public static GroupType fromString(String string) {
        for(GroupType type : values()) {
            if(type.name.equals(string)) {
                return type;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return name;
    }
}