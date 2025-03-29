export const checkIfFieldValid = (...args) => {
    if (
        [...args].some(
            (field) => typeof field !== "string" || field.trim() === ""
        )
    ) {
        return false;
    }
    return true;
};
