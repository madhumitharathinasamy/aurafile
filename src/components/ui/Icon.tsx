import {
    Maximize2,
    Minimize2,
    RefreshCw,
    Shield,
    Globe,
    Zap,
    Lock,
    LockOpen,
    Check,
    Link,
    Image as ImageIcon,
    Upload,
    Settings,
    Download,
    ArrowLeftRight,
    Star,
    Scissors,
    Crop,
    FileMinus,
    Files,
    FileText,
    ArrowRight,
    ArrowUp,
    ArrowDown,
    ChevronLeft,
    ChevronRight,
    X,
    UploadCloud,
    Sliders,
    Cpu,
    Layers,
    Share2,
    HardDrive,
    Eye,
    EyeOff,
    Maximize,
    ShieldCheck,
    Move,
    Edit3,
    Smile,
    Key,
    MousePointer2,
    Gift,
    Folder,
    Plus,
    Minus,
    Square,
    RotateCcw,
    RotateCw,
    FlipHorizontal,
    FlipVertical,
    Grid,
    Minimize,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Expand,
    FileImage,
    FilePlus,
    FileType2,
    Loader2,
    Shrink,
    Wand2,
    AlertCircle,
    Linkedin,
    Facebook,
    Mail,
    Search,
    LucideProps
} from "lucide-react";

export type IconName =
    | "resize"
    | "compress"
    | "convert"
    | "shield"
    | "globe"
    | "zap"
    | "lock"
    | "unlock"
    | "check"
    | "image"
    | "upload"
    | "settings"
    | "download"
    | "link"
    | "compare"
    | "star"
    | "scissors"
    | "crop"
    | "file-minus"
    | "files"
    | "file-text"
    | "arrow-right"
    | "arrow-up"
    | "arrow-down"
    | "chevron-left"
    | "chevron-right"
    | "x"
    | "upload-cloud"
    | "sliders"
    | "cpu"
    | "layers"
    | "share-2"
    | "hard-drive"
    | "eye"
    | "eye-off"
    | "maximize"
    | "shield-check"
    | "move"
    | "edit-3"
    | "smile"
    | "key"
    | "mouse-pointer"
    | "gift"
    | "minimize-2"
    | "folder"
    | "plus"
    | "minus"
    | "square"
    | "rotate-ccw"
    | "rotate-cw"
    | "flip-horizontal"
    | "flip-vertical"
    | "grid"
    | "minimize"
    | "check-circle"
    | "chevron-down"
    | "chevron-up"
    | "expand"
    | "file-image"
    | "file-plus"
    | "file-type-2"
    | "loader-2"
    | "shrink"
    | "wand-2"
    | "alert-circle"
    | "Linkedin"
    | "linkedin"
    | "facebook"
    | "mail"
    | "search";

const icons: Record<IconName, React.FC<LucideProps>> = {
    resize: Maximize2,
    compress: Minimize2,
    convert: RefreshCw,
    shield: Shield,
    globe: Globe,
    zap: Zap,
    lock: Lock,
    link: Link,
    unlock: LockOpen,
    check: Check,
    image: ImageIcon,
    upload: Upload,
    settings: Settings,
    download: Download,
    compare: ArrowLeftRight,
    star: Star,
    scissors: Scissors,
    crop: Crop,
    "file-minus": FileMinus,
    files: Files,
    "file-text": FileText,
    "arrow-right": ArrowRight,
    "arrow-up": ArrowUp,
    "arrow-down": ArrowDown,
    "chevron-left": ChevronLeft,
    "chevron-right": ChevronRight,
    x: X,
    "upload-cloud": UploadCloud,
    sliders: Sliders,
    cpu: Cpu,
    layers: Layers,
    "share-2": Share2,
    "hard-drive": HardDrive,
    eye: Eye,
    "eye-off": EyeOff,
    maximize: Maximize,
    "shield-check": ShieldCheck,
    move: Move,
    "edit-3": Edit3,
    smile: Smile,
    key: Key,
    "mouse-pointer": MousePointer2,
    gift: Gift,
    "minimize-2": Minimize2,
    folder: Folder,
    plus: Plus,
    minus: Minus,
    square: Square,
    "rotate-ccw": RotateCcw,
    "rotate-cw": RotateCw,
    "flip-horizontal": FlipHorizontal,
    "flip-vertical": FlipVertical,
    grid: Grid,
    minimize: Minimize,
    "check-circle": CheckCircle,
    "chevron-down": ChevronDown,
    "chevron-up": ChevronUp,
    expand: Expand,
    "file-image": FileImage,
    "file-plus": FilePlus,
    "file-type-2": FileType2,
    "loader-2": Loader2,
    shrink: Shrink,
    "wand-2": Wand2,
    "alert-circle": AlertCircle,
    Linkedin: Linkedin,
    linkedin: Linkedin,
    facebook: Facebook,
    mail: Mail,
    search: Search,
};

interface IconProps extends LucideProps {
    name: string;
}

export function Icon({ name, ...props }: IconProps) {
    const LucideIcon = icons[name as IconName] || ImageIcon;
    return <LucideIcon {...props} />;
}
