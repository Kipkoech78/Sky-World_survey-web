export const LoginFormControls = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];
export const RegisterEventFormControl = [

  {
    label: "First name",
    name: "fname",
    type: "text",
    placeholder: "John",
    required: true,
  },
  {
    label: "Last name",
    name: "lname",
    type: "text",
    placeholder: "Doe",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    label: "Phone number",
    name: "number",
    type: "number",
    placeholder: "Active phone number to receive STK push",
    required: true,
  },
  {
    label: "Company",
    name: "company",
    type: "text",
    placeholder: "Safaricom",
    required: true,
  },
  {
    label: "Position",
    name: "position",
    type: "text",
    placeholder: "Technical lead",
    required: true,
  },
  {
    label: "Attendee Type",
    name: "type",
    componentType: "select",
    options: [
      { label: "Delegate", id: "delegate" },
      { label: "Speaker", id: "speaker" },
      { label: "Exhibitor", id: "exhibitor" },
      { label: "Staff", id: "staff" },
    ],
    required: true,
  },
];

export const eventFormControls = [
  {
    label: "Event Title",
    name: "title",
    componentType: "text",
    placeholder: "Enter event name",
    required: true,
  },
  {
    label: "Event Type",
    name: "type",
    componentType: "select",
    options: [
      { label: "Social", id: "social" },
      { label: "Corporate", id: "corporate" },
      { label: "Educational", id: "educational" },
      { label: "Cultural and Entertainment", id: "culturalAndEntertainment" },
      { label: "Sports", id: "sports" },
      { label: "Religious", id: "religious" },
    ],
    required: true,
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Describe the event",
    required: true,
  },
  {
    label: "Start Date & Time",
    name: "startDate",
    type: "datetime-local",
    required: true,
  },
  {
    label: "End Date & Time",
    name: "endDate",
    type: "datetime-local",
    required: true,
  },
  {
    label: "Location / Venue",
    name: "location",
    type: "text",
    placeholder: "Enter event location",
    required: true,
  },
  {
    label: "Ticket Price",
    name: "price",
    type: "number",
    placeholder: "0 (Free) or enter price",
    required: true,
  },
  {
    label: "Capacity / Max Attendees",
    name: "capacity",
    type: "number",
    placeholder: "Enter total seats available",
    required: true,
  },
];

export const registerFormControls = [
  {
    label: "User Name",
    name: "userName",
    type: "text",
    placeholder: "Enter your first name",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    placeholder: "Confirm your password",
    required: true,
  },
];

export const categoryOptionsMap = {
  conference: "Conference",
  exhibition: "Exhibition",
};

export const filterOptions = {
  category: [
    { id: "conference", label: "Conference" },
    { id: "exhibition", label: "Exhibition" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
  { id: "date-newest", label: "Newest First" },
  { id: "date-oldest", label: "Oldest First" },
];

export const ExhibitionViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/exhibition/home",
  },
  {
    id: "conference",
    label: "Conference",
    path: "/exhibition/listing",
  },
  // {
  //   id: "events",
  //   label: "Events",
  //   path: "/exhibition/listing",
  // },
  {
    id: "exhibition",
    label: "Exhibition",
    path: "/exhibition/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/exhibition/search",
  },
];
