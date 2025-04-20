package main

import (
	"fmt"
	"github.com/getlantern/systray"
	"github.com/kbinani/screenshot"
	"github.com/progrium/macdriver/cocoa"
	"github.com/progrium/macdriver/core"
	"github.com/progrium/macdriver/objc"
	"log"
	"os"
	"os/exec"
	"strings"
)

var (
	hotkey     string
	template   string
	quit       = false
	menuItemQuit, menuItemHotkey, menuItemTemplate *systray.MenuItem
)

func onExit() {
	// Clean up here
	quit = true
	systray.Quit()
	fmt.Println("Application exited.")
}

func setHotkey(key string) {
	hotkey = key
	menuItemHotkey.SetTitle("Hotkey: " + hotkey)
}

func setTemplate(tpl string) {
	template = tpl
	menuItemTemplate.SetTitle("Template: " + template)
}

func copyCoordinatesToClipboard() {
	n := screenshot.NumActiveDisplays()
	if n == 0 {
		log.Fatal("No active displays")
	}

	bounds := screenshot.GetDisplayBounds(0)
	x, y := cocoa.NSEvent_MouseLocation().X, cocoa.NSEvent_MouseLocation().Y

	coordinates := fmt.Sprintf(template, x, y)
	cmd := exec.Command("pbcopy")
	cmd.Stdin = strings.NewReader(coordinates)
	if err := cmd.Run(); err != nil {
		log.Fatalf("Failed to copy to clipboard: %v", err)
	}
}

func main() {
	systray.Run(onReady, onExit)
}

func onReady() {
	systray.SetIcon(getIcon("icon.png"))
	systray.SetTitle("Mouse Coordinates App")
	systray.SetTooltip("Mouse Coordinates App")

	menuItemQuit = systray.AddMenuItem("Quit", "Quit the app")
	menuItemHotkey = systray.AddMenuItem("Set Hotkey", "Set hotkey for copying coordinates")
	menuItemTemplate = systray.AddMenuItem("Set Template", "Set template for coordinates")

	// Default values
	setHotkey("Ctrl+Shift+C")
	setTemplate("{X: %d, Y: %d}")

	go func() {
		<-menuItemQuit.ClickedCh
		onExit()
	}()

	go func() {
		<-menuItemHotkey.ClickedCh
		// Logic to set hotkey
	}()

	go func() {
		<-menuItemTemplate.ClickedCh
		// Logic to set template
	}()

	go func() {
		for !quit {
			// Logic to listen for hotkey press and copy coordinates
		}
	}()
}

func getIcon(s string) []byte {
	// Load icon from file
	icon, err := os.ReadFile(s)
	if err != nil {
		log.Fatalf("Failed to read icon: %v", err)
	}
	return icon
}

func init() {
	core.Init()
	objc.RegisterName("NSEvent")
	objc.RegisterObjCClass("NSEvent", objc.GetObjCClass("NSObject"))
	objc.RegisterMethod(objc.GetObjCClass("NSEvent"), "mouseLocation", "v@:")
}