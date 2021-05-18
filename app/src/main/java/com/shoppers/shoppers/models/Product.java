package com.shoppers.shoppers.models;

public class Product {
    private String id;
    private String name;
    private String img;
    private String subcategory_id;
    private String brand_id;
    private String attribute_id;
    private String catalog_id;
    private String description;
    private String barcode;
    private double stockQtt;
    private double price;

    public Product() {}

    public Product(String name, String img) {
        this.name = name;
        this.img = img;
    }

    public Product(String id, String name, String img) {
        this.id = id;
        this.name = name;
        this.img = img;
    }

    public Product(String id, String name, String img, double price, double qtt) {
        this.id = id;
        this.name = name;
        this.stockQtt = qtt;
        this.price = price;
        this.img = img;
    }

    public Product(String id, String name, String img, String subcategory_id, String brand_id, String attribute_id, String catalog_id, String description, String barcode, double stockQtt, double price) {
        this.id = id;
        this.brand_id = brand_id;
        this.attribute_id = attribute_id;
        this.catalog_id = catalog_id;
        this.description = description;
        this.barcode = barcode;
        this.stockQtt = stockQtt;
        this.price = price;
        this.name = name;
        this.img = img;
        this.subcategory_id = subcategory_id;
    }

    public String getSubcategory_id() {
        return subcategory_id;
    }

    public void setSubcategory_id(String subcategory_id) {
        this.subcategory_id = subcategory_id;
    }

    public String getBrand_id() {
        return brand_id;
    }

    public void setBrand_id(String brand_id) {
        this.brand_id = brand_id;
    }

    public String getAttribute_id() {
        return attribute_id;
    }

    public void setAttribute_id(String attribute_id) {
        this.attribute_id = attribute_id;
    }

    public String getCatalog_id() {
        return catalog_id;
    }

    public void setCatalog_id(String catalog_id) {
        this.catalog_id = catalog_id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getBarcode() {
        return barcode;
    }

    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    public double getStockQtt() {
        return stockQtt;
    }

    public void setStockQtt(double stockQtt) {
        this.stockQtt = stockQtt;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
