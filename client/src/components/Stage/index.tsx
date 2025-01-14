import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { PATH, PATH_STAGE, STAGE_DATA } from 'utils/constants';
import Connector from './Connector';

// We enuerate each stage for Stepper component
const STAGE_IDS = Object.fromEntries(
    (Object.keys(STAGE_DATA) as (keyof typeof STAGE_DATA)[]).map((key, index) => [key, index])
);

// TODO Rename to Step
const Stage = () => {
    const location = useLocation();
    const stage = PATH_STAGE[location.pathname as PATH];

    return (
        <nav>
            {/*
                TODO Make connectors dependent on the stage
                https://stackoverflow.com/questions/62796363/material-ui-stepper-4-different-connector-color-at-4-different-steps
            */}
            <Stepper activeStep={STAGE_IDS[stage]} connector={<Connector />}>
                {(Object.keys(STAGE_DATA) as (keyof typeof STAGE_DATA)[]).map((key) => {
                    const value = STAGE_DATA[key];
                    // Index can be equal to 0
                    if (!value.text || value.index === undefined) {
                        return;
                    }
                    const currentIndex = STAGE_DATA[stage]?.index;
                    const completed = !!currentIndex && value.index < currentIndex;
                    return (
                        <Step key={STAGE_IDS[key]} completed={completed}>
                            <StepLabel icon={<></>}>{value.text}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
        </nav>
    );
};

Stage.displayName = 'Stage';

export default memo(Stage);
