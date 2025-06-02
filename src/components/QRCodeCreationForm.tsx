import {
  useState,
  ChangeEvent,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { generateId, isValidUrl } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import QRCodePatternSection from "./QRCodePatternSection";
import QRCodeLogoSection from "./QRCodeLogoSection";
import QRCodeTextSection from "./QRCodeTextSection";
import QRCodeActionsSection from "./QRCodeActionsSection";
import { QRCodeModel, defaultQRModel } from "@/types/qrcode";
import QRCodePreviewSection from "./QRCodePreviewSection";
import QRCodeContentSection from "./QRCodeContentSection";
import { toPng } from "html-to-image";
import { useTemplates } from "@/lib/hooks";
import { QRCodeTemplate, QRStyle } from "@/lib/supabase/types";
import { toast } from "sonner";

const QRCodeCreationForm = () => {
  const { templates, saveTemplate } = useTemplates();
  const searchParams = useSearchParams();
  const previewRef = useRef<HTMLDivElement>(null);

  const [model, setModel] = useState<QRCodeModel>(defaultQRModel);

  // Form validation
  const isFormValid = useMemo(() => {
    if (!model.name.trim() || !model.content.trim()) return false;
    if (model.contentType === "url" && !isValidUrl(model.content)) return false;
    return true;
  }, [model.name, model.content, model.contentType]);

  // Model update helper functions
  const updateModel = useCallback((updates: Partial<QRCodeModel>) => {
    setModel((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateStyle = useCallback((updates: Partial<QRCodeModel["style"]>) => {
    setModel((prev) => ({
      ...prev,
      style: { ...prev.style, ...updates },
    }));
  }, []);

  const updateUI = useCallback((updates: Partial<QRCodeModel["ui"]>) => {
    setModel((prev) => ({
      ...prev,
      ui: { ...prev.ui, ...updates },
    }));
  }, []);

  const handleContentChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      updateModel({
        content: newContent,
      });
    },
    [updateModel]
  );

  const handleLogoUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            updateStyle({ logoImage: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [updateStyle]
  );

  // Footer image upload function
  const handleFooterImageUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            updateStyle({ footerImage: reader.result });
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [updateStyle]
  );

  const toggleColorPicker = useCallback(
    (picker: string) => {
      updateUI({
        showColorPicker: model.ui.showColorPicker === picker ? null : picker,
      });
    },
    [model.ui.showColorPicker, updateUI]
  );

  const handleTextEdit = useCallback(
    (field: string) => {
      updateUI({ isEditing: field });
    },
    [updateUI]
  );

  const handleTextEditComplete = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        updateUI({ isEditing: null });
      }
    },
    [updateUI]
  );

  const handleSaveAsTemplate = useCallback(async () => {
    if (!isFormValid) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      let thumbnail: string | undefined = undefined;
      if (previewRef.current) {
        try {
          thumbnail = await toPng(previewRef.current, {
            quality: 0.92,
            pixelRatio: 2,
          });
        } catch (err) {
          console.error("Template image could not be saved:", err);
        }
      }

      const isNew = !model.id || model.id === defaultQRModel.id;
      const templateId = isNew ? generateId() : model.id;

      const styleForSupabase: QRStyle = {
        backgroundColor: model.style.backgroundColor,
        foregroundColor: model.style.foregroundColor,
        size: model.style.size,
        level: model.style.level,
        includeMargin: model.style.includeMargin,
        titleColor: model.style.titleColor,
        subtitleColor: model.style.subtitleColor,
        title: model.style.title,
        subtitle: model.style.subtitle,
        footerText: model.style.footerText,
        logoImage: model.style.logoImage,
        footerImage: model.style.footerImage,
        dotsOptions: model.style.dotsOptions,
      };

      const templateToSave: Omit<QRCodeTemplate, "created_at" | "updated_at"> =
        {
          id: templateId,
          name: model.name,
          content: model.content,
          type: model.contentType,
          tag_ids: model.tags,
          style: styleForSupabase,
          is_template: true,
          thumbnail,
        };

      await saveTemplate(templateToSave);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Error saving template!");
    }
  }, [model, isFormValid, saveTemplate, previewRef]);



  useEffect(() => {
    const templateId = searchParams.get("template");

    if (templateId) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        const modelStyle = {
          ...defaultQRModel.style,
          ...template.style,
          dotsOptions:
            template.style.dotsOptions || defaultQRModel.style.dotsOptions,
        };

        setModel({
          id: template.id,
          name: template.name,
          content: template.content,
          contentType: template.type,
          tags: template.tag_ids || [],
          style: modelStyle,
          ui: {
            showColorPicker: null,
            isEditing: null,
          },
        });
      }
    }
  }, [searchParams, templates]);

  return (
    <div className="relative flex flex-col lg:flex-row gap-8 pb-10">
      <section className="w-full lg:w-2/3">
        {/* Frame Section */}
        <QRCodeContentSection
          model={model}
          updateModel={updateModel}
          handleContentChange={handleContentChange}
        />
        {/* QR Pattern Section */}
        <QRCodePatternSection model={model} updateStyle={updateStyle} />
        {/* Logo Section */}
        <QRCodeLogoSection
          model={model}
          handleLogoUpload={handleLogoUpload}
          handleFooterImageUpload={handleFooterImageUpload}
          updateStyle={updateStyle}
        />
        {/* Text Section */}
        <QRCodeTextSection
          model={model}
          updateStyle={updateStyle}
          toggleColorPicker={toggleColorPicker}
        />
        <QRCodeActionsSection
          isFormValid={isFormValid}
          handleSaveAsTemplate={handleSaveAsTemplate}
        />
      </section>

      <div className="flex flex-col w-full lg:w-1/3 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5rem)]">
        <QRCodePreviewSection
          model={model}
          updateStyle={updateStyle}
          handleTextEdit={handleTextEdit}
          handleTextEditComplete={handleTextEditComplete}
          updateUI={updateUI}
          previewRef={previewRef}
        />
      </div>
    </div>
  );
};

export default QRCodeCreationForm;
