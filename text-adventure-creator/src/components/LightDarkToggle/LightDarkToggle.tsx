import React from 'react';
import {Button, useColorScheme} from "@mui/joy";

// Taken from https://mui.com/joy-ui/getting-started/tutorial/#bonus-build-a-toggle-for-light-and-dark-mode
function LightDarkToggle(): JSX.Element | null {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = React.useState(false);

    // necessary for server-side rendering
    // because mode is undefined on the server
    React.useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return null;
    }

    return (
        <Button
            color="primary"
            variant="outlined"
            onClick={() => {
                setMode(mode === 'light' ? 'dark' : 'light');
            }}
        >
            {mode === 'light' ? 'Turn dark' : 'Turn light'}
        </Button>
    );
}

export default LightDarkToggle;
