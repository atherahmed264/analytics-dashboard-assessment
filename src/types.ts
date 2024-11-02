export type Tdata = {
    "2020 Census Tract":string,
    "Base MSRP":string,
    "City":string,
    "Clean Alternative Fuel Vehicle (CAFV) Eligibility":string,
    "County":string,
    "DOL Vehicle ID":string,
    "Electric Range":string,
    "Electric Utility":string,
    "Electric Vehicle Type":string,
    "Legislative District":string,
    "Make":string,
    "Model":string,
    "Model Year":string,
    "Postal Code":string,
    "State":string,
    "VIN(1 - 10)":string,
    "Vehicle Location":string,
}

export type MenuItem = 'DashBoard' | 'DemoGraphics' 
| 'Specifications & Trends' | 'CAFV Eligibility' 
| 'Range & Price' | 'Utility insights' | 'Census Tract'

export type MenuList = {
    name:MenuItem,
    icon:JSX.Element
}