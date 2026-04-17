function formatPhoneNumber(inputValue: string) {
    const digitsOnly = inputValue.replace(/\D/g, "").slice(0, 10);

    const isBangkokLandline = digitsOnly.startsWith("02");

    if (isBangkokLandline) {
        if (digitsOnly.length <= 2) {
            return digitsOnly;
        }

        if (digitsOnly.length <= 5) {
            return `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2)}`;
        }

        return `${digitsOnly.slice(0, 2)}-${digitsOnly.slice(2, 5)}-${digitsOnly.slice(5, 9)}`;
    }

    if (digitsOnly.length <= 3) {
        return digitsOnly;
    }

    if (digitsOnly.length <= 6) {
        return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    }

    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
};

export default formatPhoneNumber;