"use client";

import React from 'react';
import { Typography, Skeleton, Tabs, Tab, Box, Accordion, AccordionSummary, useMediaQuery, AccordionDetails } from '@mui/material';

export default function FiveDayForecastSkeleton() {
	const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
	
	return (
		<>
			<Box sx={{ bgcolor: 'background.paper', display: isSmall ? 'block' : 'flex' }}>
				<Tabs
					value={0}
					variant={isSmall ? 'fullWidth' : 'standard'}
					orientation={isSmall ? 'horizontal' : 'vertical'}
					sx={isSmall ? {borderBottom: 1, borderColor: 'divider'} : {borderRight: 1, borderColor: 'divider'}}
					>
					{[1,2,3,4,5].map((date) => (
						<Tab disabled key={date} label={<TabLabel />} sx={{ minWidth: { xs: '36px', sm: '135px' }}} />
					))}
				</Tabs>
				<TabContent isSelected={true}>
					{[1,2,3,4,5,6,7,8].map((hourly, idx) => (
						<Accordion key={hourly} defaultExpanded={idx === 0}>
							<AccordionSummary
								color='primary'
								sx={{ minHeight: 60, '& .MuiAccordionSummary-content': { display: 'flex', alignItems: 'center', margin: 0 }}}
								>
								<Skeleton height={55} width="100%" />
							</AccordionSummary>
							<AccordionDetails sx={{ minHeight: 48 }}>
								<Skeleton width={150} />
							</AccordionDetails>
						</Accordion>
					))}
				</TabContent>
			</Box>
		</>
	);
};

function TabLabel() {
	const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'));
	
	return (
		<>
			<Typography variant={isSmall ? 'subtitle2' : 'h6'}>
				<Skeleton width={40} />
			</Typography>
			<Typography
				variant="caption"
				color="textSecondary"
				sx={{ display: { xs: 'none', sm : 'inline' } }}
				>
				<Skeleton width={75} />
			</Typography>
		</>
	);
};

type TabContentProps = {
	isSelected: boolean;
	children?: React.ReactNode;
};

function TabContent({ isSelected, children }: TabContentProps) {
	return (
		<div style={{ flexGrow: 1 }} hidden={!isSelected}>
			<Box sx={{ px: { xs: 0, sm: 3}, py: { xs: 3, sm: 0 }}}>
				{children}
			</Box>
		</div>
  );
};