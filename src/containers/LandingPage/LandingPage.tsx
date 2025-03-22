"use client";

import React, {ReactElement} from 'react';
import {Button} from "@progress/kendo-react-buttons";
import {FiBookOpen} from "react-icons/fi";
import {GrMicrophone} from "react-icons/gr";
import {BsPencil} from "react-icons/bs";
import {LiaConfluence} from "react-icons/lia";
import {GridLayout, GridLayoutItem} from "@progress/kendo-react-layout";
import TutoringSection, {tutoringType} from "@/containers/LandingPage/TutoringSection";

// Define the Channel interface
interface Channel {
  text: string;
  value: string;
  icon: ReactElement;
}

// Define the channels array
const channels: Channel[] = [
  {
    text: 'Pronunciation',
    value: 'pronunciation',
    icon: <GrMicrophone/>,
  },
  {
    text: 'Grammar',
    value: 'grammar',
    icon: <BsPencil/>,
  },
  {
    text: 'Vocabulary',
    value: 'vocabulary',
    icon: <FiBookOpen/>,
  },
  {
    text: 'Fluency',
    value: 'fluency',
    icon: <LiaConfluence/>,
  },
];

function LandingPage() {
  const [rowHeight] = React.useState(90);
  const [colWidth] = React.useState("auto");
  const [show, setShow] = React.useState(false);
  const [type, setType] = React.useState<tutoringType>("");

  const buttonStyles = {
    fillMode: "outline" as never,
    size: null,
    className: "bg-slate-800 hover:bg-slate-700 !text-white font-semibold !py-4 !px-8 flex items-center justify-start !w-full !gap-8 !rounded-2xl text-2xl",
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-black via-[#081334] to-black text-white">
      {/* Top bar */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-xl">Personal Tutor</span>
        </div>
      </div>

      {/* Main content (centered) */}
      {show ? <TutoringSection show={show} type={type as tutoringType}/> :
        <div className="flex-grow flex flex-col justify-center items-center px-4 gap-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8">
            What would you like to{' '}
            <span className="text-blue-400">improve</span> in your English?
          </h1>

          <GridLayout
            style={{display: "grid"}}
            rows={[
              {height: rowHeight},
              {height: rowHeight},
            ]}
            cols={[{width: colWidth}, {width: colWidth}]}
            gap={{rows: 2, cols: 30}}
          >
            {channels.map((c) => (
              <GridLayoutItem key={c.value} className={"flex items-center"}>
                <Button
                  onClick={() => {
                    setShow(v => (!v));
                    setType(c.value as tutoringType);
                  }}
                  fillMode={buttonStyles.fillMode}
                  startIcon={c.icon}
                  size={buttonStyles.size}
                  className={buttonStyles.className}
                >
                  {"  "} {c.text}
                </Button>
              </GridLayoutItem>
            ))}
          </GridLayout>
        </div>}

      <div className="text-center pb-8">
        <p className="text-gray-400">
          96% of people spend years studying a language...
        </p>
      </div>
    </div>
  );
}

export default LandingPage;