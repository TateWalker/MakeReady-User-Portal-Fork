export interface ThemeProps {
    background?: string;
    colors?: {
        default: string;
        primary: string;
        secondary: string;

    }
    fonts?: string[];
    fontSizes?: {
        small: string;
        medium: string;
        large: string;
    }
}

export const dark: ThemeProps = {
    background: "#36313D",
    colors: {
        default: "#FFFFFF",
        primary: '#AFDBD2',
        secondary: "#06B49A"
    },
    fonts: ["sans-serif", "Roboto"],
    fontSizes: {
        small: "1em",
        medium: "2em",
        large: "3em"
    }
}

export const light: ThemeProps = {
    background: "#FFFFFF",
    colors: {
        default: "#000000",
        primary: "",
        secondary: ""
    }
}