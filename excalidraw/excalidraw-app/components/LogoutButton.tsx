import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export const LogoutButton = () => {
	const [loading, setLoading] = useState(false);
	const onClick = async () => {
		if (!supabase) return;
		setLoading(true);
		try {
			await supabase.auth.signOut();
			// Force reload to reset app state easily
			window.location.reload();
		} finally {
			setLoading(false);
		}
	};
	return (
		<button
			onClick={onClick}
			disabled={loading}
			style={{
				position: "fixed",
				top: 12,
				right: 12,
				background: "#374151",
				color: "#fff",
				border: "none",
				borderRadius: 8,
				padding: "8px 12px",
				cursor: loading ? "default" : "pointer",
				fontSize: 13,
			}}
		>
			{loading ? "Signing out..." : "Sign Out"}
		</button>
	);
};

export default LogoutButton;

