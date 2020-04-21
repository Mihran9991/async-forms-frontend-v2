import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { If, Then } from "react-if";

function Stepper({ children, allowNextSteps, allowPreviousSteps }) {
  const [step, setStep] = useState(0);
  const formattedChildren = Array.isArray(children) ? children : [children];

  return (
    <div className="stepper">
      {formattedChildren.map((child, idx) => {
        if (step === idx) {
          return child;
        }

        return null;
      })}

      <ButtonGroup className="mt-3">
        <If condition={Boolean(allowPreviousSteps[step] && step > 0)}>
          <Then>
            <Button variant="outline-primary" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          </Then>
        </If>
        <If
          condition={Boolean(
            allowNextSteps[step] && step < formattedChildren.length - 1
          )}
        >
          <Then>
            <Button variant="outline-primary" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          </Then>
        </If>
      </ButtonGroup>
    </div>
  );
}

export default Stepper;
