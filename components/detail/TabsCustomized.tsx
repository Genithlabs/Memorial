import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList } from '@mui/base/TabsList';
import { TabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab, tabClasses } from '@mui/base/Tab';
import Life from "./Life";
import Memory from "./Memory";
import { ALLProps } from './interfaces';


export default function TabsCustomized({ visitorMessages, memories, detail }: ALLProps) {
	return (
		<Tabs defaultValue={1}>
			<StyledTabsList>
				<StyledTab value={1}>생애<br/>Life</StyledTab>
				<StyledTab value={2}>추억과 메모리<br/>Memory And Message</StyledTab>
			</StyledTabsList>
			<StyledTabPanel value={1}><Life visitorMessages={visitorMessages} detail={detail}/></StyledTabPanel>
			<StyledTabPanel value={2}><Memory memories={memories} /></StyledTabPanel>
		</Tabs>
	);
}

const StyledTab = styled(Tab)(
	({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  color: ${theme.palette.mode === 'dark' ? 'white' : 'black'};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 80%;
  line-height: 1.5;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  background-color: ${theme.palette.mode === 'dark' ? '#222222' : '#f3f3f3'};
  box-shadow: 0px 4px 6px ${
		theme.palette.mode === 'dark' ? 'none' : 'rgba(0,0,0, 0.2)'
	};

  &.${tabClasses.selected} {
    background-color: ${theme.palette.mode === 'dark' ? 'white' : 'black'};
    color: ${theme.palette.mode === 'dark' ? 'black' : 'white'};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,
);

const StyledTabPanel = styled(TabPanel)`
  margin-top: 2rem;
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

const StyledTabsList = styled(TabsList)(
	({ theme }) => `
  border-radius: 12px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  gap: 16px;
  `,
);