package com.shoppers.shoppers.models;

public class Category {
    private String name;
    private String id;
    private int viewId;

    public Category() {}

    public Category(String name, String id, int viewId) {
        this.name = name;
        this.id = id;
        this.viewId = viewId;
    }

    public Category(String name, String id) {
        this.name = name;
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getViewId() {
        return viewId;
    }

    public void setViewId(int viewId) {
        this.viewId = viewId;
    }
}
