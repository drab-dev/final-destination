// External / framework
import React, { useState } from "react";
import { Footer } from "@excalidraw/excalidraw/index";

// Internal shared (constants, clients)
import { isExcalidrawPlusSignedUser } from "../app_constants";

import { supabase } from "../lib/supabaseClient";

// Local components
import { DebugFooter, isVisualDebuggerEnabled } from "./DebugCanvas";
import { EncryptedIcon } from "./EncryptedIcon";
import { ExcalidrawPlusAppLink } from "./ExcalidrawPlusAppLink";

export const AppFooter = React.memo(
  ({ onChange }: { onChange: () => void }) => {
    return (
      <Footer>
        <div
          style={{
            display: "flex",
            gap: ".5rem",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
            {isVisualDebuggerEnabled() && <DebugFooter onChange={onChange} />}
            {isExcalidrawPlusSignedUser ? (
              <ExcalidrawPlusAppLink />
            ) : (
              <EncryptedIcon />
            )}
          </div>
          <SignOutButton />
        </div>
      </Footer>
    );
  },
);

const SignOutButton = () => {
  const [loading, setLoading] = useState(false);
  if (!supabase) {
    return null;
  }
  if (!supabase) {
    return null;
  }
  const client = supabase; // narrowed
  const onClick = async () => {
    setLoading(true);
    try {
      await client.auth.signOut();
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      title="Sign out"
      style={{
        background: "#991b1b",
        color: "#fff",
        border: "1px solid #dc2626",
        padding: "6px 12px",
        borderRadius: 6,
        fontSize: 12,
        fontWeight: 600,
        cursor: loading ? "default" : "pointer",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
};
