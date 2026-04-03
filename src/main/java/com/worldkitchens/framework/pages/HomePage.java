package com.worldkitchens.framework.pages;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import java.util.List;

public class HomePage {
    
    private WebDriver driver;

    // WebElements defined using @FindBy

    @FindBy(id = "search-input")
    private WebElement searchInput;

    @FindBy(id = "host-portal-btn")
    private WebElement hostPortalBtn;

    @FindBy(id = "driver-portal-btn")
    private WebElement driverPortalBtn;

    @FindBy(css = ".filter-group .filter-btn")
    private List<WebElement> filterButtons;

    @FindBy(id = "kitchen-list")
    private WebElement kitchenList;

    @FindBy(id = "dashboard-host-title")
    private WebElement hostDashboardTitle;

    @FindBy(id = "dashboard-driver-title")
    private WebElement driverDashboardTitle;

    // Constructor to initialize PageFactory
    public HomePage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(driver, this);
    }

    // Action Methods

    public void enterSearchText(String text) {
        searchInput.clear();
        searchInput.sendKeys(text);
    }

    public void clickHostPortal() {
        hostPortalBtn.click();
    }

    public void clickDriverPortal() {
        driverPortalBtn.click();
    }

    public boolean isSearchInputDisplayed() {
        return searchInput.isDisplayed();
    }

    public boolean isKitchenListDisplayed() {
        return kitchenList.isDisplayed();
    }

    public String getHostDashboardTitle() {
        return hostDashboardTitle.getText();
    }

    public String getDriverDashboardTitle() {
        return driverDashboardTitle.getText();
    }
}
