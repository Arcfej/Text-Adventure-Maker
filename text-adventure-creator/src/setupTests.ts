import '@testing-library/jest-dom/extend-expect';

jest.mock('./components/LightDarkToggle/LightDarkToggle', () => {
    return () => null;
});
