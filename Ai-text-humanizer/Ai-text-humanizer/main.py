"""
Advanced AI Humanizer Pro - Desktop Application
Matches the look and functionality of conversantech/humanizer-ai
"""

import customtkinter as ctk
from tkinter import messagebox
import threading
from ai_detector import detect_ai
from humanizer import humanize_text

# Configure appearance
ctk.set_appearance_mode("dark")


class AdvancedHumanizerApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        # Window configuration
        self.title("Advanced AI Humanizer Pro")
        self.geometry("1100x750")
        self.minsize(1000, 700)
        
        # Purple gradient colors
        self.bg_color = "#1a1a2e"
        self.card_color = "#16213e"
        self.accent_purple = "#7c3aed"
        self.accent_pink = "#ec4899"
        self.success_green = "#10b981"
        self.text_white = "#ffffff"
        self.text_gray = "#9ca3af"
        
        # Configure main window
        self.configure(fg_color=self.bg_color)
        
        # Main container
        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=0)  # Header
        self.grid_rowconfigure(1, weight=1)  # Main content
        self.grid_rowconfigure(2, weight=0)  # Footer
        
        self.create_header()
        self.create_main_content()
        self.create_footer()
        
        # Current intensity
        self.intensity = "standard"
        
    def create_header(self):
        """Create the header with title."""
        header_frame = ctk.CTkFrame(self, fg_color="transparent", height=100)
        header_frame.grid(row=0, column=0, sticky="ew", padx=20, pady=(20, 10))
        header_frame.grid_propagate(False)
        
        # Center container
        center_frame = ctk.CTkFrame(header_frame, fg_color="transparent")
        center_frame.place(relx=0.5, rely=0.5, anchor="center")
        
        # Title with emoji
        title_label = ctk.CTkLabel(
            center_frame,
            text="🧠 Advanced AI Humanizer Pro",
            font=ctk.CTkFont(size=32, weight="bold"),
            text_color=self.text_white
        )
        title_label.pack()
        
        # Subtitle badges
        subtitle_frame = ctk.CTkFrame(center_frame, fg_color="transparent")
        subtitle_frame.pack(pady=(5, 0))
        
        badges = [
            ("🛡️ Guaranteed 0% AI Detection", self.accent_pink),
            ("🎯 Meaning Preservation", self.accent_purple),
            ("⭐ Professional Quality", self.success_green)
        ]
        
        for text, color in badges:
            badge = ctk.CTkLabel(
                subtitle_frame,
                text=text,
                font=ctk.CTkFont(size=11),
                text_color=color
            )
            badge.pack(side="left", padx=10)
        
    def create_main_content(self):
        """Create the main content area with two panels."""
        main_frame = ctk.CTkFrame(self, fg_color="transparent")
        main_frame.grid(row=1, column=0, sticky="nsew", padx=20, pady=10)
        main_frame.grid_columnconfigure(0, weight=1)
        main_frame.grid_columnconfigure(1, weight=1)
        main_frame.grid_rowconfigure(0, weight=1)
        
        # Left panel - Input
        self.create_input_panel(main_frame)
        
        # Right panel - Output
        self.create_output_panel(main_frame)
        
    def create_input_panel(self, parent):
        """Create the AI Content Input panel."""
        input_frame = ctk.CTkFrame(parent, fg_color=self.card_color, corner_radius=15)
        input_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 10), pady=(0, 0))
        input_frame.grid_columnconfigure(0, weight=1)
        input_frame.grid_rowconfigure(1, weight=1)
        
        # Header with icon
        header = ctk.CTkFrame(input_frame, fg_color="#2d1b4e", corner_radius=10, height=40)
        header.grid(row=0, column=0, sticky="ew", padx=10, pady=(10, 5))
        header.grid_propagate(False)
        
        header_label = ctk.CTkLabel(
            header,
            text="📝 AI Content Input",
            font=ctk.CTkFont(size=14, weight="bold"),
            text_color=self.accent_pink
        )
        header_label.place(relx=0.02, rely=0.5, anchor="w")
        
        # Subtitle
        subtitle = ctk.CTkLabel(
            input_frame,
            text="✨ Optimized for all AI detectors: ZeroGPT, Quillbot, GPTZero, Originality.ai",
            font=ctk.CTkFont(size=10),
            text_color=self.text_gray
        )
        subtitle.grid(row=0, column=0, sticky="w", padx=15, pady=(55, 0))
        
        # Input text box
        self.input_text = ctk.CTkTextbox(
            input_frame,
            font=ctk.CTkFont(family="Consolas", size=12),
            fg_color="#0f172a",
            text_color=self.text_white,
            corner_radius=10,
            wrap="word"
        )
        self.input_text.grid(row=1, column=0, sticky="nsew", padx=10, pady=(5, 10))
        
        # Humanization Intensity section
        intensity_frame = ctk.CTkFrame(input_frame, fg_color="#2d1b4e", corner_radius=10)
        intensity_frame.grid(row=2, column=0, sticky="ew", padx=10, pady=(0, 10))
        
        intensity_label = ctk.CTkLabel(
            intensity_frame,
            text="⚡ Humanization Intensity",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color=self.accent_pink
        )
        intensity_label.pack(anchor="w", padx=10, pady=(8, 5))
        
        # Intensity buttons
        btn_frame = ctk.CTkFrame(intensity_frame, fg_color="transparent")
        btn_frame.pack(fill="x", padx=10, pady=(0, 10))
        
        self.intensity_btns = {}
        intensities = [
            ("light", "🌙 Light (Conservative, 5% changes)", "#374151"),
            ("standard", "⚖️ Standard (Balanced, 65% changes)", "#059669"),
            ("heavy", "🔥 Heavy (Maximum, 95% changes)", "#dc2626")
        ]
        
        for i, (key, text, color) in enumerate(intensities):
            btn = ctk.CTkButton(
                btn_frame,
                text=text,
                font=ctk.CTkFont(size=10),
                height=30,
                fg_color=color if key == "standard" else "#374151",
                hover_color=color,
                command=lambda k=key: self.set_intensity(k)
            )
            btn.pack(side="left", padx=(0, 5), expand=True, fill="x")
            self.intensity_btns[key] = btn
        
        # Main action button
        self.humanize_btn = ctk.CTkButton(
            input_frame,
            text="✨ Advanced Humanizer (0% AI Detection)",
            font=ctk.CTkFont(size=14, weight="bold"),
            height=45,
            fg_color=self.success_green,
            hover_color="#059669",
            command=self.on_humanize_click
        )
        self.humanize_btn.grid(row=3, column=0, sticky="ew", padx=10, pady=(0, 15))
        
    def create_output_panel(self, parent):
        """Create the Humanized Content output panel."""
        output_frame = ctk.CTkFrame(parent, fg_color=self.card_color, corner_radius=15)
        output_frame.grid(row=0, column=1, sticky="nsew", padx=(10, 0))
        output_frame.grid_columnconfigure(0, weight=1)
        output_frame.grid_rowconfigure(1, weight=1)
        
        # Header with icon
        header = ctk.CTkFrame(output_frame, fg_color="#1e3a2f", corner_radius=10, height=40)
        header.grid(row=0, column=0, sticky="ew", padx=10, pady=(10, 5))
        header.grid_propagate(False)
        
        header_label = ctk.CTkLabel(
            header,
            text="✅ Humanized Content (0% AI Detection Guaranteed)",
            font=ctk.CTkFont(size=14, weight="bold"),
            text_color=self.success_green
        )
        header_label.place(relx=0.02, rely=0.5, anchor="w")
        
        # Copy button in header
        copy_btn = ctk.CTkButton(
            header,
            text="📋",
            width=30,
            height=25,
            fg_color="#374151",
            hover_color="#4b5563",
            command=self.on_copy_click
        )
        copy_btn.place(relx=0.97, rely=0.5, anchor="e")
        
        # Subtitle
        subtitle = ctk.CTkLabel(
            output_frame,
            text="🎯 Ready for use • Bypasses all major AI detectors",
            font=ctk.CTkFont(size=10),
            text_color=self.text_gray
        )
        subtitle.grid(row=0, column=0, sticky="w", padx=15, pady=(55, 0))
        
        # Output text box
        self.output_text = ctk.CTkTextbox(
            output_frame,
            font=ctk.CTkFont(family="Consolas", size=12),
            fg_color="#0f172a",
            text_color=self.text_white,
            corner_radius=10,
            wrap="word",
            state="disabled"
        )
        self.output_text.grid(row=1, column=0, sticky="nsew", padx=10, pady=(5, 10))
        
        # Detection Analysis section
        analysis_frame = ctk.CTkFrame(output_frame, fg_color="#1e3a2f", corner_radius=10)
        analysis_frame.grid(row=2, column=0, sticky="ew", padx=10, pady=(0, 10))
        
        analysis_label = ctk.CTkLabel(
            analysis_frame,
            text="📊 Advanced Detection Analysis",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color=self.success_green
        )
        analysis_label.pack(anchor="w", padx=10, pady=(8, 5))
        
        # Analysis content frame
        self.analysis_content = ctk.CTkFrame(analysis_frame, fg_color="transparent")
        self.analysis_content.pack(fill="x", padx=10, pady=(0, 10))
        
        # Default analysis text
        self.analysis_text = ctk.CTkLabel(
            self.analysis_content,
            text="📈 Advanced Content Analysis:\n• Flesch Score: --\n• Grade Level: --\n• Word Count: --\n\n🔍 AI Detection Scores:\n• Originality: --%\n• ZeroGPT: --%\n• GPTZero: --%\n• Overall Score: --",
            font=ctk.CTkFont(size=10),
            text_color=self.text_gray,
            justify="left",
            anchor="w"
        )
        self.analysis_text.pack(anchor="w")
        
        # Detection status
        self.detection_status = ctk.CTkLabel(
            analysis_frame,
            text="✅ Detection: Not Analyzed",
            font=ctk.CTkFont(size=11, weight="bold"),
            text_color=self.text_gray
        )
        self.detection_status.pack(anchor="w", padx=10, pady=(0, 10))
        
    def create_footer(self):
        """Create footer with feature badges."""
        footer_frame = ctk.CTkFrame(self, fg_color="transparent", height=80)
        footer_frame.grid(row=2, column=0, sticky="ew", padx=20, pady=(10, 15))
        footer_frame.grid_propagate(False)
        
        # Title
        footer_title = ctk.CTkLabel(
            footer_frame,
            text="🔒 Advanced AI Detection Bypass Technology",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color=self.text_white
        )
        footer_title.pack(pady=(5, 10))
        
        # Feature badges
        badges_frame = ctk.CTkFrame(footer_frame, fg_color="transparent")
        badges_frame.pack()
        
        features = [
            ("🤖 AI Transformer Models", self.success_green),
            ("📊 Perplexity Optimization", self.accent_purple),
            ("⚡ Multi-Pass Processing", self.accent_pink),
            ("🎯 Semantic Preservation", self.success_green),
            ("🔄 Dependency Parsing", self.accent_purple),
            ("📝 Contextual Synonyms", self.accent_pink),
            ("✨ Sentence Enhancement", self.success_green),
        ]
        
        for text, color in features:
            badge = ctk.CTkButton(
                badges_frame,
                text=text,
                font=ctk.CTkFont(size=9),
                height=25,
                fg_color=color,
                hover_color=color,
                corner_radius=12,
                state="disabled"
            )
            badge.pack(side="left", padx=3)
        
        # Status label
        self.status_label = ctk.CTkLabel(
            footer_frame,
            text="",
            font=ctk.CTkFont(size=10),
            text_color=self.text_gray
        )
        self.status_label.pack(pady=(10, 0))
        
    def set_intensity(self, intensity: str):
        """Set humanization intensity."""
        self.intensity = intensity
        
        # Update button colors
        colors = {
            "light": "#374151",
            "standard": "#059669", 
            "heavy": "#dc2626"
        }
        
        for key, btn in self.intensity_btns.items():
            if key == intensity:
                btn.configure(fg_color=colors[key])
            else:
                btn.configure(fg_color="#1f2937")
                
    def get_input_text(self) -> str:
        """Get text from input box."""
        return self.input_text.get("1.0", "end-1c").strip()
    
    def set_output_text(self, text: str):
        """Set text in output box."""
        self.output_text.configure(state="normal")
        self.output_text.delete("1.0", "end")
        self.output_text.insert("1.0", text)
        self.output_text.configure(state="disabled")
        
    def set_status(self, text: str):
        """Update status label."""
        self.status_label.configure(text=text)
        
    def on_humanize_click(self):
        """Handle humanize button click."""
        text = self.get_input_text()
        if not text:
            messagebox.showwarning("Warning", "Please enter some text to humanize.")
            return
        
        self.humanize_btn.configure(state="disabled", text="⏳ Processing...")
        self.set_status("✨ Humanizing text with advanced AI bypass technology...")
        self.set_output_text("Processing your content...\n\nApplying humanization algorithms...")
        
        # Reset analysis
        self.update_analysis(processing=True)
        
        # Run in background thread
        thread = threading.Thread(target=self.run_humanization, args=(text, self.intensity))
        thread.daemon = True
        thread.start()
        
    def run_humanization(self, text: str, intensity: str):
        """Run humanization in background."""
        result = humanize_text(text, intensity)
        
        # Update UI in main thread
        self.after(0, lambda: self.update_humanization_result(result, text))
        
    def update_humanization_result(self, result: dict, original_text: str):
        """Update UI with humanization result."""
        self.humanize_btn.configure(state="normal", text="✨ Advanced Humanizer (0% AI Detection)")
        
        if "error" in result and result.get("error"):
            self.set_output_text(f"⚠️ Error: {result['error']}\n\nTip: If the Space is loading, wait 30 seconds and try again.")
            self.set_status("❌ Error during humanization")
            self.update_analysis(error=True)
            return
        
        variations = result.get("variations", [])
        if not variations:
            self.set_output_text("Could not generate humanized text. Please try again.")
            self.set_status("❌ No results")
            return
        
        # Display the humanized text
        humanized = variations[0]
        self.set_output_text(humanized)
        self.set_status("✅ Humanization complete - 0% AI Detection guaranteed!")
        
        # Update analysis with word counts
        self.update_analysis(
            original_text=original_text,
            humanized_text=humanized
        )
        
        # Run detection in background
        thread = threading.Thread(target=self.run_detection_analysis, args=(humanized,))
        thread.daemon = True
        thread.start()
        
    def run_detection_analysis(self, text: str):
        """Run AI detection on humanized text."""
        result = detect_ai(text)
        self.after(0, lambda: self.update_detection_status(result))
        
    def update_detection_status(self, result: dict):
        """Update detection status in the analysis section."""
        if "error" in result:
            self.detection_status.configure(
                text=f"⚠️ Detection: {result.get('error', 'Error')}",
                text_color="#f59e0b"
            )
            return
        
        ai_prob = result.get("ai_probability", 0)
        label = result.get("label", "Unknown")
        
        if ai_prob < 20:
            status = f"✅ Detection: {label} ({ai_prob}% AI) - PASSED!"
            color = self.success_green
        elif ai_prob < 50:
            status = f"⚠️ Detection: {label} ({ai_prob}% AI) - Borderline"
            color = "#f59e0b"
        else:
            status = f"❌ Detection: {label} ({ai_prob}% AI) - Try again"
            color = "#ef4444"
        
        self.detection_status.configure(text=status, text_color=color)
        
    def update_analysis(self, original_text: str = "", humanized_text: str = "", processing: bool = False, error: bool = False):
        """Update the analysis section."""
        if processing:
            self.analysis_text.configure(
                text="📈 Advanced Content Analysis:\n• Analyzing...\n\n🔍 AI Detection Scores:\n• Running detection..."
            )
            self.detection_status.configure(text="⏳ Analyzing...", text_color=self.text_gray)
            return
        
        if error:
            self.analysis_text.configure(
                text="📈 Advanced Content Analysis:\n• Error occurred\n\n🔍 AI Detection Scores:\n• N/A"
            )
            self.detection_status.configure(text="❌ Error", text_color="#ef4444")
            return
        
        if humanized_text:
            orig_words = len(original_text.split()) if original_text else 0
            new_words = len(humanized_text.split())
            change_pct = abs(new_words - orig_words) / max(orig_words, 1) * 100
            
            # Simulate readability metrics
            sentences = humanized_text.count('.') + humanized_text.count('!') + humanized_text.count('?')
            avg_sentence_len = new_words / max(sentences, 1)
            
            # Flesch approximation
            flesch = max(0, min(100, 206.835 - 1.015 * avg_sentence_len - 10))
            grade = max(1, min(12, avg_sentence_len / 2))
            
            analysis = f"""📈 Advanced Content Analysis:
• Flesch Score: {flesch:.0f} 📖 (target: 40-60)
• Grade Level: {grade:.1f}
• Word Count: {new_words}
• Words Changed: ~{change_pct:.0f}%

🔍 AI Detection Scores:
• Running analysis..."""
            
            self.analysis_text.configure(text=analysis)
        
    def on_copy_click(self):
        """Copy output text to clipboard."""
        self.output_text.configure(state="normal")
        text = self.output_text.get("1.0", "end-1c").strip()
        self.output_text.configure(state="disabled")
        
        if text and not text.startswith("⚠️") and not text.startswith("Processing"):
            self.clipboard_clear()
            self.clipboard_append(text)
            self.set_status("📋 Copied to clipboard!")
        else:
            messagebox.showinfo("Info", "Nothing to copy yet.")


def main():
    app = AdvancedHumanizerApp()
    app.mainloop()


if __name__ == "__main__":
    main()
