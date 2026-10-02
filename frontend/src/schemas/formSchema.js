export const insuranceClaimSchema = {
  id: "insurance-claim",

  title: "Insurance Claim Form",

  description: "Provide details about the incident.",

  fields: [
    {
      name: "fullName",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,

      validation: {
        minLength: 3,
        maxLength: 50,
      },
    },

    {
      name: "incidentType",
      type: "select",
      label: "Incident Type",
      required: true,

      options: [
        {
          label: "Accident",
          value: "accident",
        },
        {
          label: "Animal Collision",
          value: "animal_collision",
        },
        {
          label: "Theft",
          value: "theft",
        },
      ],
    },

    {
      name: "vehicle",
      type: "text",
      label: "Vehicle",
      placeholder: "Example: Honda City",
      required: true,

      validation: {
        minLength: 2,
        maxLength: 50,
      },
    },

    {
      name: "description",
      type: "textarea",
      label: "Incident Description",
      placeholder: "Describe what happened...",
      required: true,

      validation: {
        minLength: 10,
        maxLength: 500,
      },
    },

    {
      name: "hasDamage",
      type: "checkbox",
      label: "Was the vehicle damaged?",
    },

    {
      name: "damageDescription",
      type: "textarea",
      label: "Damage Description",
      placeholder: "Describe the damage...",
      required: true,

      validation: {
        minLength: 10,
        maxLength: 500,
      },

      condition: {
        field: "hasDamage",
        operator: "equals",
        value: true,
      },
    },
  ],
};