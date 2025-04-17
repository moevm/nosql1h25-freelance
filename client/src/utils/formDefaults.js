export const createBaseForm = () => ({
    type: {
        value: null,
        error: '',
        rules: {},
    },
    title: {
        value: '',
        error: '',
        rules: {min: 10, max: 100 },
    },
    annotation: {
        value: '',
        error: '',
        rules: {min: 30, max: 200 },
    },
    description: {
        value: '',
        error: '',
        rules: {min: 100, max: 20000 },
    },
    prizepool: {
        value: '',
        error: '',
        rules: {min: 0, max: 9999999 },
    },
    endBy: {
        value: '',
        error: '',
        rules: { minDays: 3 },
    },
    files: {
        error: '',
        rules: { max: 20 }
    }
});

export const createSolutionForm = () => ({
    description: {
        value: '',
        error: '',
        rules: { min: 100, max: 20000 },
    },
    files: {
        error: '',
        rules: { max: 20 },
        allowedTypes: ['application/zip', 'application/x-zip-compressed', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
    }
});
