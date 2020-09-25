// VEHICLE BODY TYPE
export const VehicleBodyType = [
    { label: 'SEDAN', value: 'SEDAN' },
    { label: 'VAN', value: 'VAN' },
    { label: 'TRUCK', value: 'TRUCK' },
    { label: 'SUV', value: 'SUV' }
];

// MOTOR COMPREHENSIVE LOADING OPTIONS
export const MotorComprehensiveLoadingOptions = [
    {
        label: 'Increased Third Party Limit',
        value: 'increasedThirdPartyLimits'
    },
    { label: 'Riot and strike', value: 'riotAndStrike' },
    { label: 'Car Stereo', value: 'carStereo' },
    { label: 'Territorial Extension', value: 'territorailExtension' },
    { label: 'Loss Of Use', value: 'lossOfUse' },
    { label: 'Inexperienced Driver', value: 'inexperiencedDriver' },
    { label: 'Under Age Driver', value: 'underAgeDriver' },
    { label: 'Loss Of Keys', value: 'lossOfKeys' },
    // { label: 'Malicious Damage', value: 'maliciousDamage' },
    { label: 'Medical Expenses', value: 'medicalExpenses' },
    { label: 'Injury/Death', value: 'injury/death' },
    { label: 'Property Damage', value: 'propertyDamage' },
    // { label: 'Earthquake', value: 'earthquake' },
    { label: 'Explosions', value: 'explosions' },
    // { label: 'Financial Loss', value: 'financialLoss' },
    // { label: 'Fire And Allied Perils', value: 'fireAndAlliedPerils' },
    { label: 'Legal Expenses', value: 'legalExpenses' },
    // { label: 'Landslide', value: 'landslide' },
    { label: 'Passenger Liability', value: 'passengerLiability' },
    { label: 'Permanent Disability', value: 'permanentDisability' }
];

// MOTOR THIRD PARTY LOADING OPTIONS
export const MotorThirdPartyLoadingOptions = [
    {
        label: 'Increased Third Party Limit',
        value: 'increasedThirdPartyLimits'
    }
];

// DISCOUNT OPTIONS
export const DiscountOptions = [
    { label: 'No claims dicount', value: 'noClaimsDiscount' },
    { label: 'Loyalty Discount', value: 'loyaltyDiscount' },
    { label: 'Valued Client Discount', value: 'valuedClientDiscount' },
    { label: 'Low Term Agreement', value: 'lowTermAgreementDiscount' }
];

// SOURCE OF BUSINESS OPTIONS
export const SourceOfBusinessOptions = [
    { label: 'Direct', value: 'Direct' },
    { label: 'Broker', value: 'Broker' },
    { label: 'Agent', value: 'Agent' },
    { label: 'Sales Representative', value: 'SalesRepresentative' }
];

// PRODUCT TYPE OPTIONS
export const ProductTypeOptions = [
    { label: 'Private', value: 'Private' },
    { label: 'Commercial', value: 'Commercial' },
    { label: 'Bus/Taxi', value: 'Bus/Taxi' }
];

export const CorporateProductTypeOptions = [
    { label: 'Private', value: 'Private' },
    { label: 'Business', value: 'Business' },
    { label: 'Bus/Taxi', value: 'Bus/Taxi' }
];

// ACCIDENT PRODUCT TYPE OPTIONS
export const AccidentProductTypeOptions = [
    { label: 'Private', value: 'Private' },
    { label: 'Commercial', value: 'Commercial' }
];

// RISK CATEGORY OPTIONS
export const RiskCategoryOptions = [
    { label: 'A (RESIDENTIAL)', value: 'A (RESIDENTIAL)' },
    { label: 'B (COMMERCIAL)', value: 'B (COMMERCIAL)' },
    { label: 'C (MEGA RISK)', value: 'C (MEGA RISK)' }
];

// RISK SUB CLASS OPTIONS
export const RiskSubClassOptions = [
    { label: 'HOUSE OWNERS', value: 'HOUSE OWNERS' },
    { label: 'BUILDINGS COMBINED', value: 'BUILDINGS COMBINED' },
    { label: 'BUSINESS INTERRUPTION', value: 'BUSINESS INTERRUPTION' }
];

// POLICY CANCELLATION TYPES
export const CancellationTypeOptions = [
    { label: 'Time On Risk', value: 'timeOnRisk' },
    { label: 'Full Refund', value: 'fullRefund' }
];

// PROPERTY ROOF TYPE OPTIONS
export const RoofTypeOptions = [
    { label: 'STANDARD', value: 'STANDARD' },
    { label: 'THATCHED', value: 'THATCHED' }
];

// COVER TYPE OPTIONS
export const CoverTypeOptions = [{ label: 'STANDARD', value: 'STANDARD' }];

// INSURANCE TYPE OPTIONS
export const InsuranceTypeOptions = [
    {
        id: 'b3fa196d-e5d5-416b-ae4d-a338d42bf422',
        label: 'Motor Comprehensive',
        value: 'Comprehensive'
    },
    {
        id: '3cbdeca7-4e4f-4e21-9131-d54ba43f8bd6',
        label: 'Full Third Party',
        value: 'ThirdParty'
    },
    {
        id: '830157ef-1d2a-4eab-b8d7-49126fcb5b3c',
        label: 'Act Only Cover',
        value: 'ActOnly'
    },
    {
        id: '836abcd7-f80f-4d3b-a720-1945c54a2098',
        label: 'Third Party Fire And Theft',
        value: 'ThirdPartyFireAndTheft'
    }
];

// LIMITS OF LIABILITY OPTIONS
export const LimitsOfLiabilityOptions = [
    { label: 'Third Party Liability Combined Limit', value: 'combinedLimits' },
    { label: 'Standard', value: 'standardLimits' }
];

// EXCESSES OPTIONS
export const ExcessesOptions = [
    { label: 'Collision And Fire', value: 'CollisionAndFire' },
    {
        label: 'Theft Of Vehicle With Anti Theft Device',
        value: 'TheftOfVehicleWithAntiTheftDevice'
    },
    {
        label: 'Theft Of Vehicle Without Anti Theft Device',
        value: 'TheftOfVehicleWithoutAntiTheftDevice'
    },
    { label: 'Third Party Property Damage', value: 'ThirdPartyPropertyDamage' }
];
