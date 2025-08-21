import * as icons from "lucide-vue-next";

export function useLucideIcon() {
    const isLucideIcon = (icon: string | undefined) => {
        if (!icon) return "";
        return icon.startsWith("Lucide-");
    }

    const lucideIconName = (icon: string | undefined) => {
        if (!icon) return ""
        const iconName = icon.replace("Lucide-", "") ?? "";
        if (!iconName) return null;
        return (icons as any)[iconName] || null;
    }

    

    return {
        isLucideIcon,
        lucideIconName,
    }
}
