"use client"
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const FilterSrc = ({ title, options, value, onChange, disabled }) => {
    return (
        <Autocomplete
            disablePortal
            options={options}
            value={value}
            onChange={onChange}
            sx={{ width: 250 }}
            size='small'
            disabled={disabled}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={title}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#dc2626',
                            },
                            '&:hover fieldset': {
                                borderColor: '#dc2626',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#dc2626',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: '#1E293B',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: '#dc2626',
                        },
                    }}
                />
            )}
        />
    );
}

export default FilterSrc;
