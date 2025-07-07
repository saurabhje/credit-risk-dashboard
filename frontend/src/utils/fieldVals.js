export const fieldLabels = {
  SEX: {
    1: "Male",
    2: "Female",
  },
  EDUCATION: {
    1: "Graduate School",
    2: "University",
    3: "High School",
    4: "Others",
    5: "Unknown",
    6: "Unknown",
    0: "Unknown",
  },
  MARRIAGE: {
    1: "Married",
    2: "Single",
    3: "Other",
    0: "Unknown",
  },
  "default payment next month": {
    0: "No",
    1: "Yes",
  },
    PAY: {
    "-2": "No Consumption",
    "-1": "Paid in Full",
    "0": "Paid on Time",
    "1": "1 Month Delay",
    "2": "2 Months Delay",
    "3": "3 Months Delay",
    "4": "4 Months Delay",
    "5": "5 Months Delay",
    "6": "6 Months Delay",
    "7": "7 Months Delay",
    "8": "8 Months Delay",
    "9": "9+ Months Delay",
  },
};

export function formatValue(key, value) {
  if (fieldLabels[key] && fieldLabels[key][value] !== undefined) {
    return fieldLabels[key][value];
  }

  if (key.startsWith("PAY_") && !key.startsWith("PAY_AMT")) {
    const label =  fieldLabels.PAY[String(value)];
    if (label !== undefined) return label;

  }
  return value;
}
