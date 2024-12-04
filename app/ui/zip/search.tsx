'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField } from '@mui/material';
import { zipCodeSchema } from '@/app/lib/schemas';

type ZipSearchProps = {
	zip?: string
};

export default function ZipSearch({ zip='' }: ZipSearchProps) {
	const {
		register,
		handleSubmit,
		trigger,
		formState: { errors, defaultValues }
	} = useForm<z.infer<typeof zipCodeSchema>>({
		mode: 'onChange',
		resolver: zodResolver(zipCodeSchema),
		defaultValues: { zip }
	});
	const { push } = useRouter();
	const [isFocused, setIsFocused] = useState<boolean>(false);
	const formSubmit = handleSubmit(({ zip }, event) => {
		event?.preventDefault();
		push(`/weather/${zip}`);
	});
	
	// If there is a zip to prefill, run validation on mount
	useEffect(() => {
		if (zip.length > 0) {
			trigger();
		}
	}, [zip, trigger]);
	
	return (
		<Box
			onSubmit={formSubmit}
			component="form"
			noValidate
			autoComplete="off"
			sx={{ width: '100%', textAlign: 'center', '& > :not(style)': { m: 1, width: '16ch' } }}
			>
			<TextField
				label="Zip Code"
				variant="outlined"
				placeholder="search"
				{...register('zip')}
				error={!!errors.zip}
				defaultValue={defaultValues?.zip}
				helperText={errors.zip?.message || (isFocused ? 'Press enter' : ' ')}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				slotProps={{
					inputLabel: { shrink: true }
				}}
				/>
    </Box>
  );
};
