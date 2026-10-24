"use client";

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type DragEvent,
  type ReactNode,
} from "react";
import { cx } from "../utils/cx";
import { Close } from "../utils/icons";
import { useFieldProps } from "./field";

/** Readable size: 820 B, 14.2 KB, 3.5 MB. */
export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value < 10 ? value.toFixed(1) : Math.round(value)} ${units[unit]}`;
}

/** Whether a file matches an `accept` list such as "image/*,.pdf". */
export function acceptsFile(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean)
    .some((rule) =>
      rule.startsWith(".")
        ? name.endsWith(rule)
        : rule.endsWith("/*")
          ? type.startsWith(rule.slice(0, -1))
          : type === rule,
    );
}

export type FileRejection = { file: File; reason: "type" | "size" | "count" };

type Rules = { accept?: string; maxSize?: number; maxFiles?: number };

/** Splits files into accepted and rejected ones, with the reason of each rejection. */
export function validateFiles(files: File[], { accept, maxSize, maxFiles }: Rules, alreadyAccepted = 0) {
  const accepted: File[] = [];
  const rejected: FileRejection[] = [];
  for (const file of files) {
    if (!acceptsFile(file, accept)) rejected.push({ file, reason: "type" });
    else if (maxSize !== undefined && file.size > maxSize) rejected.push({ file, reason: "size" });
    else if (maxFiles !== undefined && alreadyAccepted + accepted.length >= maxFiles)
      rejected.push({ file, reason: "count" });
    else accepted.push(file);
  }
  return { accepted, rejected };
}

export type FileInputProps = Omit<ComponentPropsWithoutRef<"input">, "type" | "value" | "defaultValue" | "onChange"> & {
  onFilesChange?: (files: File[]) => void;
  buttonLabel?: string;
  placeholder?: string;
  /** Text when several files are chosen: "3 files". */
  countLabel?: (count: number) => string;
  invalid?: boolean;
};

/**
 * Compact file field: a "Choose a file" button and the chosen names, on the native file input
 * (hidden but focusable). Works inside `Field` like `Input`.
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(function FileInput(
  {
    onFilesChange,
    buttonLabel = "Choose a file",
    placeholder = "No file chosen",
    countLabel = (count) => `${count} files`,
    disabled,
    invalid,
    className,
    ...props
  },
  ref,
) {
  const [files, setFiles] = useState<File[]>([]);
  const a11y = useFieldProps({ ...props, invalid });
  const summary = files.length === 0 ? placeholder : files.length === 1 ? files[0]!.name : countLabel(files.length);
  return (
    <label className={cx("trc-file-input", disabled && "trc-file-input--disabled", className)}>
      <input
        ref={ref}
        {...props}
        {...a11y}
        type="file"
        disabled={disabled}
        className="trc-visually-hidden"
        onChange={(e) => {
          const chosen = [...(e.target.files ?? [])];
          setFiles(chosen);
          onFilesChange?.(chosen);
        }}
      />
      <span aria-hidden className="trc-file-input__button">
        {buttonLabel}
      </span>
      <span className={cx("trc-file-input__name", files.length === 0 && "trc-file-input__name--empty")}>{summary}</span>
    </label>
  );
});

export type DropzoneProps = Rules & {
  multiple?: boolean;
  /** Called with every accepted file after each change. */
  onFilesChange?: (files: File[]) => void;
  /** Main text: "Drop files here or". */
  title?: ReactNode;
  /** Link-looking word that opens the file picker: "browse". */
  browseLabel?: ReactNode;
  /** Constraints shown under the title: "PNG or PDF, up to 5 MB". */
  hint?: ReactNode;
  removeLabel?: (file: File) => string;
  /** Message of a rejected file. */
  rejectionLabel?: (rejection: FileRejection) => string;
  name?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
};

const defaultRejection = ({ file, reason }: FileRejection) =>
  `${file.name}: ${reason === "type" ? "this type of file is not accepted" : reason === "size" ? "the file is too large" : "too many files"}`;

/**
 * Area to drop files on, or to click (and reach with the keyboard) to browse. Accepted files are
 * listed with their size and a remove button; rejected ones are announced with their reason.
 */
export function Dropzone({
  accept,
  maxSize,
  maxFiles,
  multiple = true,
  onFilesChange,
  title = "Drop files here or",
  browseLabel = "browse",
  hint,
  removeLabel = (file) => `Remove ${file.name}`,
  rejectionLabel = defaultRejection,
  name,
  disabled,
  id,
  className,
}: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [rejections, setRejections] = useState<FileRejection[]>([]);
  const [dragging, setDragging] = useState(false);
  const hintId = useId();
  const a11y = useFieldProps({ id });

  const add = (incoming: File[]) => {
    const base = multiple ? files : [];
    const { accepted, rejected } = validateFiles(
      multiple ? incoming : incoming.slice(0, 1),
      { accept, maxSize, maxFiles },
      base.length,
    );
    const next = [...base, ...accepted];
    setFiles(next);
    setRejections(rejected);
    onFilesChange?.(next);
  };
  const remove = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    setFiles(next);
    setRejections([]);
    onFilesChange?.(next);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (!disabled) add([...e.dataTransfer.files]);
  };

  return (
    <div className={cx("trc-dropzone", className)}>
      <label
        className={cx(
          "trc-dropzone__area",
          dragging && "trc-dropzone__area--dragging",
          disabled && "trc-dropzone__area--disabled",
        )}
        onDragEnter={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false);
        }}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          name={name}
          disabled={disabled}
          className="trc-visually-hidden"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            add([...(e.target.files ?? [])]);
            // Choosing the same file again must trigger a change.
            e.target.value = "";
          }}
          {...a11y}
          aria-describedby={cx(a11y["aria-describedby"], hint != null && hintId) || undefined}
        />
        <span className="trc-dropzone__title">
          {title} <span className="trc-dropzone__browse">{browseLabel}</span>
        </span>
        {/* Out of the field's name; read as its description instead. */}
        {hint != null && (
          <span id={hintId} aria-hidden className="trc-dropzone__hint">
            {hint}
          </span>
        )}
      </label>

      <div aria-live="polite">
        {rejections.length > 0 && (
          <ul className="trc-dropzone__rejections">
            {rejections.map((rejection, i) => (
              <li key={i}>{rejectionLabel(rejection)}</li>
            ))}
          </ul>
        )}
      </div>

      {files.length > 0 && (
        <ul className="trc-dropzone__files">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="trc-dropzone__file">
              <span className="trc-dropzone__file-name">{file.name}</span>
              <span className="trc-dropzone__file-size">{formatBytes(file.size)}</span>
              <button
                type="button"
                className="trc-dropzone__remove"
                aria-label={removeLabel(file)}
                onClick={() => remove(i)}
              >
                <Close />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
