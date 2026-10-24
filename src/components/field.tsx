import { createContext, forwardRef, useContext, useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "../utils/cx";
import { ChevronDown } from "../utils/icons";

type FieldContextValue = { id: string; describedBy?: string; invalid: boolean; required: boolean };

const FieldContext = createContext<FieldContextValue | null>(null);

export type FieldProps = {
  label: ReactNode;
  /** Aide affichée sous le champ. */
  hint?: ReactNode;
  /** Message d'erreur : remplace l'aide et marque le champ comme invalide. */
  error?: ReactNode;
  required?: boolean;
  /** Identifiant du champ ; généré sinon. */
  id?: string;
  className?: string;
  children: ReactNode;
};

/**
 * Libellé, aide et erreur d'un champ. Le champ placé dedans (`Input`, `Textarea`, `Select`)
 * reçoit automatiquement son `id`, `aria-describedby` et `aria-invalid`.
 */
export function Field({ label, hint, error, required = false, id, className, children }: FieldProps) {
  const generated = useId();
  const fieldId = id ?? generated;
  const messageId = `${fieldId}-message`;
  const message = error ?? hint;
  return (
    <FieldContext.Provider
      value={{ id: fieldId, describedBy: message ? messageId : undefined, invalid: error != null, required }}
    >
      <div className={cx("trc-field", className)}>
        <label htmlFor={fieldId} className="trc-field__label">
          {label}
          {required && (
            <span aria-hidden className="trc-field__required">
              {" "}
              *
            </span>
          )}
        </label>
        {children}
        {message != null && (
          <p id={messageId} className={cx("trc-field__message", error != null && "trc-field__message--error")}>
            {message}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}

/** Attributs d'accessibilité venant du `Field` parent, sans écraser ceux passés au champ. */
function useFieldProps(props: { id?: string; required?: boolean; invalid?: boolean; "aria-describedby"?: string }) {
  const field = useContext(FieldContext);
  const invalid = props.invalid ?? field?.invalid ?? false;
  return {
    id: props.id ?? field?.id,
    required: props.required ?? field?.required,
    "aria-describedby": cx(field?.describedBy, props["aria-describedby"]) || undefined,
    "aria-invalid": invalid || undefined,
  };
}

type ControlProps = { invalid?: boolean };

export type InputProps = ComponentPropsWithoutRef<"input"> & ControlProps;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ invalid, className, ...props }, ref) {
  const a11y = useFieldProps({ ...props, invalid });
  return <input ref={ref} className={cx("trc-control", className)} {...props} {...a11y} />;
});

export type TextareaProps = ComponentPropsWithoutRef<"textarea"> & ControlProps;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, rows = 4, className, ...props },
  ref,
) {
  const a11y = useFieldProps({ ...props, invalid });
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cx("trc-control", "trc-control--textarea", className)}
      {...props}
      {...a11y}
    />
  );
});

export type SelectProps = ComponentPropsWithoutRef<"select"> &
  ControlProps & {
    /** Option vide affichée tant que rien n'est choisi. */
    placeholder?: string;
  };

/** Liste native (accessible et adaptée au mobile), habillée d'un chevron fin. */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { invalid, placeholder, defaultValue, className, children, ...props },
  ref,
) {
  const a11y = useFieldProps({ ...props, invalid });
  // Sans valeur fournie, l'option vide reste affichée (sinon le navigateur choisit la première option active).
  const initial = defaultValue ?? (props.value === undefined && placeholder != null ? "" : undefined);
  return (
    <span className={cx("trc-select", className)}>
      <select ref={ref} className="trc-control trc-control--select" defaultValue={initial} {...props} {...a11y}>
        {placeholder != null && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      <ChevronDown className="trc-select__chevron" />
    </span>
  );
});
