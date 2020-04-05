import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { If, Else, Then } from "react-if";

function Stepper({ children, allowNext }) {
  const [step, setStep] = useState(0);
  const formattedChildren = Array.isArray(children) ? children : [children];
  //step < formattedChildren.length - 1
  return (
    <div className="stepper">
      {formattedChildren.map((child, idx) => {
        if (step === idx) {
          return child;
        }

        return null;
      })}

      <ButtonGroup className="mt-3">
        <If condition={allowNext}>
          <Then>
            <Button variant="outline-primary" onClick={() => setStep(step + 1)}>
              Next
            </Button>
          </Then>
          <Else>
            <If condition={step > 0}>
              <Button
                variant="outline-primary"
                onClick={() => setStep(step - 1)}
              >
                Previous
              </Button>
            </If>
          </Else>
        </If>
      </ButtonGroup>
    </div>
  );
}

export default Stepper;
