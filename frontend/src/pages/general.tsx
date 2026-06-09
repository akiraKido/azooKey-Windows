import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Keyboard, RefreshCcw } from "lucide-react";

export const General = () => {
    const [macLikeImeKeys, setMacLikeImeKeys] = useState(false);

    useEffect(() => {
        invoke<any>("get_config")
            .then((data) => {
                setMacLikeImeKeys(Boolean(data.shortcuts?.mac_like_ime_keys));
            })
            .catch(() => {
                // Keep default values if config fetch fails.
            });
    }, []);

    const updateConfig = async (updater: (config: any) => void) => {
        try {
            const data = await invoke<any>("get_config");
            data.shortcuts ??= { mac_like_ime_keys: false };
            updater(data);
            await invoke("update_config", { newConfig: data });
            return data;
        } catch (error) {
            toast("設定の更新に失敗しました");
            return null;
        }
    };

    const handleMacLikeImeKeysChange = async (checked: boolean) => {
        const data = await updateConfig((data) => {
            data.shortcuts.mac_like_ime_keys = checked;
        });

        if (data) {
            setMacLikeImeKeys(data.shortcuts.mac_like_ime_keys);
        }
    };

    return (
        <div className="space-y-8">
            <section className="space-y-2">
                <h1 className="text-sm font-bold text-foreground">バージョンと更新プログラム</h1>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <RefreshCcw />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            v0.1.0-alpha.1
                        </p>
                    </div>
                    <Button variant="secondary">
                        <a href="https://github.com/fkunn1326/azooKey-Windows/releases" className="flex items-center gap-x-2" target="_blank" rel="noopener noreferrer">
                            <ExternalLink />
                            更新を確認する
                        </a>
                    </Button>
                </div>
            </section>

            <section className="space-y-2">
                <h1 className="text-sm font-bold text-foreground">キー設定</h1>
                <div className="flex items-center space-x-4 rounded-md border p-4">
                    <Keyboard />
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            mac風の英数/かなキー
                        </p>
                        <p className="text-xs text-muted-foreground">
                            無変換キーで英数、変換キーでかなに切り替えます。
                        </p>
                    </div>
                    <Switch checked={macLikeImeKeys} onCheckedChange={handleMacLikeImeKeysChange} />
                </div>
            </section>
        </div>
    );
};
