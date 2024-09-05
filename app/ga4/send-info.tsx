"use client";
import React from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
function SendInfo() {
    const handleSendGA4 = () => {
        console.log('send GA4')
        sendGAEvent("event", "buttonClicked", { value: "F28R319MYW" })
    }
  return (
    <Button
      onClick={handleSendGA4}
    >
      送出
    </Button>
  );
}

export default SendInfo;
