import {
  createIcons, Search, Box, Play, Pause, RotateCcw, Maximize,
  Check, Plus, Printer, ArrowLeft, ArrowUpRight, BookOpen,
  Leaf, Bug, Waves, Layers, X, RefreshCw
} from "lucide";

window.LittleNatureIcons = () => createIcons({
  icons: { Search, Box, Play, Pause, RotateCcw, Maximize, Check, Plus, Printer,
    ArrowLeft, ArrowUpRight, BookOpen, Leaf, Bug, Waves, Layers, X, RefreshCw },
  attrs: { width: 18, height: 18, "stroke-width": 1.8, "aria-hidden": "true", focusable: "false" }
});
window.LittleNatureIcons();
