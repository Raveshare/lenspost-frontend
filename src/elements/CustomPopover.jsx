import React from 'react'

// Donate more Modal imports - Blueprintjs 20Aug2023
import { Button } from "@blueprintjs/core"
import { Popover2 } from "@blueprintjs/popover2";
import { Slider } from "@blueprintjs/core";
import { useState } from 'react';

const CustomPopover = ({ icon, isSplitPopover }) => {

  const [stSliderValue, setStSliderValue] = useState(30);
  const [stIpValue, setStIpValue] = useState(0);

  const fnHandleSliderChange = (value) => {
    console.log(value);
    setStSliderValue(value);

    // Use `stIpValue` to send to the backend
    setStIpValue(value);

  }

  return (
    <>
      {/* Donate more Modal components - Blueprintjs 20Aug2023 */}
      <div
        className='ml-4 mb-4'
        onClick={(e) => {
          e.stopPropagation();
        }}
      > 

      {/* Popover starts here */}
        <Popover2

          content={
            isSplitPopover &&
            <>
              <div className="w-64 p-1 rounded-md bg-gradient-to-t from-white to-yellow-100">
                {/* background gradient using tailwind  */}
                {/* div className="rounded-md bg-gradient-to-r from-green-400 to-blue-500"> */}
                <div className="rounded-md bottom-4 m-2 p-2">
                  {/* text gradient css using tailwindcss  */}
                  <div className="mb-1 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-400">
                    Thank you
                  </div>  
                  <div className="">
                    <div className="mb-6">
                      For considering to split your post's revenue with  <a href="https://lenster.xyz/u/lenspostxyz" target='_blank'>@lenspostxyz.</a>
                      <br /> We believe that this will help us to grow and provide better services to you.
                    </div>
                    <div className="rounded-lg w-full p-1">
                      <input className='w-full p-0.5 border border-t-0 border-l-0 border-r-0 border-b-yellow-400 focus: outline-none'
                        type="text"
                        onChange={(e) => setStIpValue(e.target.value)}
                        placeholder='Enter Split percentage'
                        value={`${stIpValue == 0 ? "" : stIpValue}`}
                      />
                    </div>
                    <div className="ml-1 mt-2 mb-1">or choose</div>
                    {/* This is the slider from Blueprintjs/core  */}
                    <div className="m-1 mt-0 p-1">
                      <Slider min={20}
                        max={50}
                        stepSize={10}
                        labelStepSize={10}
                        onChange={fnHandleSliderChange}
                        value={stSliderValue}
                        labelRenderer={stSliderValue}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          }
          position={"auto"}
        >
          <div>
            <Button small className='px-2 py-0' icon={`${icon ? icon : "help"}`} />
          </div>
        </Popover2>
      {/* Popover Ends here */}

      </div>

    </>
  )
}
export default CustomPopover;