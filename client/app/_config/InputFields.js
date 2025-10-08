import {
	inputContainerStyle,
	inputStyle,
	errorStyle,
} from "../_components/styles";

const baseField = {
	type: "text",
	containerClassName: inputContainerStyle,
	inputClassName: inputStyle,
	errorClassName: errorStyle,
};

// Common fields for Create/Edit forms
export const getCreateEditInputFields = ({
	formData,
	setFormData,
	validationErrors,
	onBlur,
}) => [
	{
		...baseField,
		name: "text",
		placeholder: "Quote text (min 10 chars)",
		value: formData.text,
		onChange: (e) => setFormData({ ...formData, text: e.target.value }),
		error: validationErrors?.text,
		multiline: true,
		rows: 3,
		minRows: 4,
		onBlur,
	},
	{
		...baseField,
		name: "author",
		placeholder: "Author (2-255 chars)",
		value: formData.author,
		onChange: (e) => setFormData({ ...formData, author: e.target.value }),
		error: validationErrors?.author,
		onBlur,
	},
	{
		...baseField,
		name: "categories",
		placeholder: "Categories (comma-separated, e.g. life, success)",
		value: formData.categories,
		onChange: (e) => setFormData({ ...formData, categories: e.target.value }),
		error: validationErrors?.categories,
		onBlur,
	},
];

// Fields for Search form
export const getSearchInputFields = ({
	formData,
	setFormData,
	validationErrors,
	setValidationErrors,
	validateSearch,
}) => [
	{
		...baseField,
		name: "text",
		placeholder: "Search by text",
		value: formData.text,
		onChange: (e) => setFormData({ ...formData, text: e.target.value }),
		error: validationErrors?.text,
		onBlur: () =>
			setValidationErrors(
				validateSearch({
					text: formData.text,
					author: formData.author,
					category: formData.category,
					limit: formData.limit,
				}),
			),
	},
	{
		...baseField,
		name: "author",
		placeholder: "Search by author",
		value: formData.author,
		onChange: (e) => setFormData({ ...formData, author: e.target.value }),
		error: validationErrors?.author,
		onBlur: () =>
			setValidationErrors(
				validateSearch({
					text: formData.text,
					author: formData.author,
					category: formData.category,
					limit: formData.limit,
				}),
			),
	},
	{
		...baseField,
		name: "category",
		placeholder: "Search by category",
		value: formData.category,
		onChange: (e) => setFormData({ ...formData, category: e.target.value }),
		error: validationErrors?.category,
		onBlur: () =>
			setValidationErrors(
				validateSearch({
					text: formData.text,
					author: formData.author,
					category: formData.category,
					limit: formData.limit,
				}),
			),
		errorClassName: baseField.errorClassName + " px-5",
	},
];
