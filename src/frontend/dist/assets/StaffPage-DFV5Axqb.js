import { j as jsxRuntimeExports, S as Slot, c as cn, f as cva, r as reactExports, u as useComposedRefs, b as backend, B as Button, I as Input } from "./index-TdD9R_9D.js";
import { C as Card, a as CardContent } from "./card-CiNzoqcO.js";
import { f as createContextScope, i as useId, P as Primitive, j as composeEventHandlers, h as useControllableState, g as useCallbackRef, o as Presence, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Dx8gBYWO.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DagaGlZ2.js";
import { c as createCollection, u as useDirection } from "./index-CQqOWFEm.js";
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-destructive-foreground [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME = "RovingFocusGroup";
var [Collection, useCollection, createCollectionScope] = createCollection(GROUP_NAME);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME,
  [createCollectionScope]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME);
var RovingFocusGroup = reactExports.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME;
var RovingFocusGroupImpl = reactExports.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = reactExports.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = reactExports.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection(__scopeRovingFocusGroup);
  const isClickFocusRef = reactExports.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: reactExports.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: reactExports.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: reactExports.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME = "RovingFocusGroupItem";
var RovingFocusGroupItem = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    reactExports.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;
var TABS_NAME = "Tabs";
var [createTabsContext] = createContextScope(TABS_NAME, [
  createRovingFocusGroupScope
]);
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
var Tabs$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeTabs,
      value: valueProp,
      onValueChange,
      defaultValue,
      orientation = "horizontal",
      dir,
      activationMode = "automatic",
      ...tabsProps
    } = props;
    const direction = useDirection(dir);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: TABS_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsProvider,
      {
        scope: __scopeTabs,
        baseId: useId(),
        value,
        onValueChange: setValue,
        orientation,
        dir: direction,
        activationMode,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            dir: direction,
            "data-orientation": orientation,
            ...tabsProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
Tabs$1.displayName = TABS_NAME;
var TAB_LIST_NAME = "TabsList";
var TabsList$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, loop = true, ...listProps } = props;
    const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Root,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        orientation: context.orientation,
        dir: context.dir,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "tablist",
            "aria-orientation": context.orientation,
            ...listProps,
            ref: forwardedRef
          }
        )
      }
    );
  }
);
TabsList$1.displayName = TAB_LIST_NAME;
var TRIGGER_NAME = "TabsTrigger";
var TabsTrigger$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
    const context = useTabsContext(TRIGGER_NAME, __scopeTabs);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        active: isSelected,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "tab",
            "aria-selected": isSelected,
            "aria-controls": contentId,
            "data-state": isSelected ? "active" : "inactive",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            id: triggerId,
            ...triggerProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onValueChange(value);
              } else {
                event.preventDefault();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => {
              const isAutomaticActivation = context.activationMode !== "manual";
              if (!isSelected && !disabled && isAutomaticActivation) {
                context.onValueChange(value);
              }
            })
          }
        )
      }
    );
  }
);
TabsTrigger$1.displayName = TRIGGER_NAME;
var CONTENT_NAME = "TabsContent";
var TabsContent$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
    const context = useTabsContext(CONTENT_NAME, __scopeTabs);
    const triggerId = makeTriggerId(context.baseId, value);
    const contentId = makeContentId(context.baseId, value);
    const isSelected = value === context.value;
    const isMountAnimationPreventedRef = reactExports.useRef(isSelected);
    reactExports.useEffect(() => {
      const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
      return () => cancelAnimationFrame(rAF);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": isSelected ? "active" : "inactive",
        "data-orientation": context.orientation,
        role: "tabpanel",
        "aria-labelledby": triggerId,
        hidden: !present,
        id: contentId,
        tabIndex: 0,
        ...contentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
        },
        children: present && children
      }
    ) });
  }
);
TabsContent$1.displayName = CONTENT_NAME;
function makeTriggerId(baseId, value) {
  return `${baseId}-trigger-${value}`;
}
function makeContentId(baseId, value) {
  return `${baseId}-content-${value}`;
}
var Root2 = Tabs$1;
var List = TabsList$1;
var Trigger = TabsTrigger$1;
var Content = TabsContent$1;
function Tabs({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root2,
    {
      "data-slot": "tabs",
      className: cn("flex flex-col gap-2", className),
      ...props
    }
  );
}
function TabsList({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    List,
    {
      "data-slot": "tabs-list",
      className: cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className
      ),
      ...props
    }
  );
}
function TabsTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "tabs-trigger",
      className: cn(
        "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function TabsContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content,
    {
      "data-slot": "tabs-content",
      className: cn("flex-1 outline-none", className),
      ...props
    }
  );
}
const ROLES = [
  { label: "Tailor", value: "Tailor" },
  { label: "Cutter", value: "Cutter" },
  { label: "Helper", value: "Helper" },
  { label: "Manager", value: "Manager" },
  { label: "Receptionist", value: "Receptionist" },
  { label: "Other", value: "Other" }
];
const ROLE_COLORS = {
  Tailor: "#1F7E78",
  Cutter: "#2563EB",
  Helper: "#7C3AED",
  Manager: "#0F2233",
  Receptionist: "#D97706",
  Other: "#6B7280"
};
function getRoleLabel(role) {
  return Object.keys(role)[0] ?? "Other";
}
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function StaffIDCard({
  staff,
  onClose
}) {
  const cardRef = reactExports.useRef(null);
  const roleLabel = getRoleLabel(staff.role);
  const color = ROLE_COLORS[roleLabel];
  const joinDate = new Date(
    Number(staff.joinDate) / 1e6
  ).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  const handlePrint = () => {
    const el = cardRef.current;
    if (!el) return;
    const win = window.open("", "_blank", "width=400,height=600");
    if (!win) return;
    win.document.write(`
      <html><head><title>Staff ID - ${staff.name}</title>
      <style>
        body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f3f4f6; font-family: Inter, sans-serif; }
      </style></head><body>
      ${el.outerHTML}
      </body></html>
    `);
    win.document.close();
    win.onload = () => {
      win.print();
    };
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm p-0 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: cardRef,
        style: {
          fontFamily: "Inter, sans-serif",
          background: "white",
          borderRadius: 16,
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                background: color,
                padding: "28px 20px 20px",
                textAlign: "center"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: {
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                      fontWeight: "bold",
                      color: "white",
                      margin: "0 auto 12px",
                      border: "3px solid rgba(255,255,255,0.5)"
                    },
                    children: getInitials(staff.name)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    style: {
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 12,
                      margin: "0 0 4px"
                    },
                    children: "Ali Tailor ✂️"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    style: {
                      color: "white",
                      fontSize: 20,
                      fontWeight: 700,
                      margin: "0 0 6px"
                    },
                    children: staff.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      display: "inline-block",
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      borderRadius: 20,
                      padding: "2px 14px",
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase"
                    },
                    children: roleLabel
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "20px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: 16 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  style: {
                    fontSize: 10,
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    margin: 0
                  },
                  children: "Staff ID"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  style: {
                    fontSize: 22,
                    fontWeight: 800,
                    color,
                    letterSpacing: 2,
                    margin: 0
                  },
                  children: staff.staffId
                }
              )
            ] }),
            [
              { label: "Department", val: staff.department },
              { label: "Phone", val: staff.phone },
              { label: "Email", val: staff.email },
              { label: "Joined", val: joinDate }
            ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  gap: 8,
                  marginBottom: 8,
                  fontSize: 12
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#9ca3af", width: 70, flexShrink: 0 }, children: label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#111827", fontWeight: 500 }, children: val })
                ]
              },
              label
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                background: "#f9fafb",
                borderTop: "1px solid #e5e7eb",
                padding: "10px 20px",
                textAlign: "center",
                fontSize: 10,
                color: "#9ca3af"
              },
              children: "Ali Tailor ERP · Staff Identity Card"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 p-4 border-t", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: onClose, children: "Close" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "flex-1 bg-[#1F7E78] hover:bg-[#166661] text-white",
          onClick: handlePrint,
          children: "🖨️ Print ID"
        }
      )
    ] })
  ] }) });
}
function SetPasswordDialog({
  staff,
  onClose
}) {
  const [newPw, setNewPw] = reactExports.useState("");
  const [confirmPw, setConfirmPw] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState(false);
  const trimmedPhone = staff.phone.trim();
  const hasExisting = !!localStorage.getItem(`tailorpro_pw_${trimmedPhone}`);
  const handleSave = () => {
    setError("");
    if (!newPw) {
      setError("Password cannot be empty.");
      return;
    }
    if (newPw !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    localStorage.setItem(`tailorpro_pw_${trimmedPhone}`, newPw);
    setSuccess(true);
    setTimeout(() => onClose(), 1200);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: hasExisting ? "Change Password" : "Set Password" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-500", children: [
      "Staff:",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-gray-800", children: staff.name })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "New Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "password",
            placeholder: "Enter new password",
            value: newPw,
            onChange: (e) => setNewPw(e.target.value),
            "data-ocid": "set_password.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Confirm Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "password",
            placeholder: "Confirm password",
            value: confirmPw,
            onChange: (e) => setConfirmPw(e.target.value),
            "data-ocid": "set_password.input"
          }
        )
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-red-600 bg-red-50 rounded px-2 py-1",
          "data-ocid": "set_password.error_state",
          children: error
        }
      ),
      success && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-xs text-green-600 bg-green-50 rounded px-2 py-1",
          "data-ocid": "set_password.success_state",
          children: "✅ Password saved!"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          "data-ocid": "set_password.cancel_button",
          children: "Cancel"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
          onClick: handleSave,
          "data-ocid": "set_password.save_button",
          children: "Save Password"
        }
      )
    ] })
  ] }) });
}
function StaffPage() {
  const [staffList, setStaffList] = reactExports.useState([]);
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [editStaff, setEditStaff] = reactExports.useState(null);
  const [viewCard, setViewCard] = reactExports.useState(null);
  const [setPwStaff, setSetPwStaff] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [pwRefresh, setPwRefresh] = reactExports.useState(0);
  const [copiedPhone, setCopiedPhone] = reactExports.useState(null);
  const [saving, setSaving] = reactExports.useState(false);
  const [formError, setFormError] = reactExports.useState("");
  const [form, setForm] = reactExports.useState({
    name: "",
    role: "Tailor",
    phone: "",
    email: "",
    department: "",
    joinDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
    address: ""
  });
  const load = reactExports.useCallback(() => backend.getStaff().then(setStaffList), []);
  reactExports.useEffect(() => {
    load();
  }, [load]);
  const openAdd = () => {
    setEditStaff(null);
    setFormError("");
    setForm({
      name: "",
      role: "Tailor",
      phone: "",
      email: "",
      department: "",
      joinDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
      address: ""
    });
    setShowAdd(true);
  };
  const openEdit = (s) => {
    setEditStaff(s);
    setFormError("");
    const joinDate = new Date(Number(s.joinDate / 1000000n)).toISOString().slice(0, 10);
    setForm({
      name: s.name,
      role: getRoleLabel(s.role),
      phone: s.phone,
      email: s.email,
      department: s.department,
      joinDate,
      address: s.address
    });
    setShowAdd(true);
  };
  const save = async () => {
    setFormError("");
    if (!form.name.trim()) {
      setFormError("Name is required.");
      return;
    }
    if (!form.phone.trim()) {
      setFormError("Phone number is required.");
      return;
    }
    setSaving(true);
    try {
      const roleObj = { [form.role]: null };
      const joinDateVal = form.joinDate ? new Date(form.joinDate).getTime() : Date.now();
      const joinDateMs = BigInt(Math.floor(joinDateVal)) * 1000000n;
      if (editStaff) {
        await backend.updateStaff(
          editStaff.id,
          form.name.trim(),
          roleObj,
          form.phone.trim(),
          form.email.trim(),
          form.department.trim(),
          joinDateMs,
          form.address.trim()
        );
      } else {
        await backend.addStaff(
          form.name.trim(),
          roleObj,
          form.phone.trim(),
          form.email.trim(),
          form.department.trim(),
          joinDateMs,
          form.address.trim()
        );
      }
      setShowAdd(false);
      load();
    } catch {
      setFormError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  const del = async (id) => {
    if (confirm("Delete this staff member?")) {
      await backend.deleteStaff(id);
      load();
    }
  };
  const handleSetPwClose = () => {
    setSetPwStaff(null);
    setPwRefresh((n) => n + 1);
  };
  const handleResetPassword = (phone) => {
    if (confirm(
      "Reset this staff member's password? They won't be able to log in until a new password is set."
    )) {
      localStorage.removeItem(`tailorpro_pw_${phone.trim()}`);
      setPwRefresh((n) => n + 1);
    }
  };
  const handleCopyPhone = (phone) => {
    navigator.clipboard.writeText(phone).then(() => {
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 1500);
    });
  };
  const filtered = staffList.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) || s.staffId.includes(search) || s.phone.includes(search)
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-[#111827]", children: "Staff Management" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: openAdd,
          className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
          "data-ocid": "staff.primary_button",
          children: "+ Add Staff"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-0 shadow-sm mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search by name, ID, or phone...",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "max-w-xs mb-4",
          "data-ocid": "staff.search_input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "id-cards", "data-ocid": "staff.tab", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "id-cards", "data-ocid": "staff.id_cards.tab", children: "🪪 ID Cards" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            TabsTrigger,
            {
              value: "credentials",
              "data-ocid": "staff.credentials.tab",
              children: "🔐 Credentials"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "id-cards", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: [
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-gray-400 col-span-4 py-8 text-center",
              "data-ocid": "staff.empty_state",
              children: "No staff found"
            }
          ),
          filtered.map((s, idx) => {
            const roleLabel = getRoleLabel(s.role);
            const color = ROLE_COLORS[roleLabel];
            const hasPw = !!localStorage.getItem(
              `tailorpro_pw_${s.phone.trim()}`
            );
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": `staff.item.${idx + 1}`,
                className: "rounded-xl overflow-hidden shadow-md border border-gray-100 bg-white hover:shadow-lg transition-shadow",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      style: {
                        background: color,
                        padding: "18px 16px 14px",
                        textAlign: "center"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: {
                              width: 52,
                              height: 52,
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.25)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 20,
                              fontWeight: "bold",
                              color: "white",
                              margin: "0 auto 8px",
                              border: "2px solid rgba(255,255,255,0.5)"
                            },
                            children: getInitials(s.name)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-sm", children: s.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              display: "inline-block",
                              background: "rgba(255,255,255,0.2)",
                              color: "white",
                              borderRadius: 20,
                              padding: "1px 10px",
                              fontSize: 10,
                              fontWeight: 600,
                              letterSpacing: "0.5px",
                              textTransform: "uppercase"
                            },
                            children: roleLabel
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-center font-bold text-lg",
                        style: { color },
                        children: s.staffId
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs text-gray-500 mb-3", children: s.department }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-gray-500", children: [
                      "📞 ",
                      s.phone
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setViewCard(s),
                        className: "w-full mt-3 text-xs py-1.5 rounded-lg font-semibold text-white",
                        style: { background: color },
                        "data-ocid": `staff.view_button.${idx + 1}`,
                        children: "View ID"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => openEdit(s),
                          className: "flex-1 text-xs py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium",
                          "data-ocid": `staff.edit_button.${idx + 1}`,
                          children: "Edit"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => del(s.id),
                          className: "flex-1 text-xs py-1.5 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 border-0",
                          "data-ocid": `staff.delete_button.${idx + 1}`,
                          children: "Delete"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setSetPwStaff(s),
                        className: "w-full mt-2 text-xs py-1.5 rounded-lg border font-medium transition-colors",
                        style: {
                          borderColor: hasPw ? "#d1d5db" : "#1F7E78",
                          color: hasPw ? "#6b7280" : "#1F7E78",
                          background: hasPw ? "#f9fafb" : "#f0fdfb"
                        },
                        "data-ocid": `staff.set_password_button.${idx + 1}`,
                        children: hasPw ? "🔑 Change Password" : "🔑 Set Password"
                      }
                    )
                  ] })
                ]
              },
              String(s.id)
            );
          })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "credentials", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-sm text-gray-400 py-8 text-center",
            "data-ocid": "staff.credentials.empty_state",
            children: "No staff found"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-xl border border-gray-100 overflow-x-auto",
            "data-ocid": "staff.credentials.table",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-gray-50", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-gray-700", children: "Staff Member" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-gray-700", children: "Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-gray-700", children: "Mobile Number" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-gray-700", children: "Password" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-semibold text-gray-700 text-right", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((s, idx) => {
                const roleLabel = getRoleLabel(s.role);
                const color = ROLE_COLORS[roleLabel];
                const hasPw = pwRefresh >= 0 && !!localStorage.getItem(
                  `tailorpro_pw_${s.phone.trim()}`
                );
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TableRow,
                  {
                    "data-ocid": `staff.credentials.row.${idx + 1}`,
                    className: "hover:bg-gray-50",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            style: { background: color },
                            className: "w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0",
                            children: getInitials(s.name)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-sm text-gray-800", children: s.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-gray-400", children: s.staffId })
                        ] })
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white",
                          style: { background: color },
                          children: roleLabel
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-sm font-semibold text-gray-800 tracking-wide", children: [
                          "📞 ",
                          s.phone
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => handleCopyPhone(s.phone),
                            className: "text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors",
                            title: "Copy number",
                            "data-ocid": `staff.credentials.copy_button.${idx + 1}`,
                            children: copiedPhone === s.phone ? "✅" : "📋"
                          }
                        )
                      ] }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: hasPw ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-100 text-green-700 border-green-200 hover:bg-green-100", children: "✓ Set" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "secondary",
                          className: "bg-gray-100 text-gray-500",
                          children: "Not Set"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "text-xs h-7 border-[#1F7E78] text-[#1F7E78] hover:bg-[#f0fdfb]",
                            onClick: () => setSetPwStaff(s),
                            "data-ocid": `staff.credentials.set_password_button.${idx + 1}`,
                            children: [
                              "🔑 ",
                              hasPw ? "Change" : "Set Password"
                            ]
                          }
                        ),
                        hasPw && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "text-xs h-7 border-red-200 text-red-500 hover:bg-red-50",
                            onClick: () => handleResetPassword(s.phone),
                            "data-ocid": `staff.credentials.reset_button.${idx + 1}`,
                            children: "🗑️ Reset"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            className: "text-xs h-7 bg-red-500 hover:bg-red-600 text-white border-0",
                            onClick: () => del(s.id),
                            "data-ocid": `staff.credentials.delete_button.${idx + 1}`,
                            children: "Delete"
                          }
                        )
                      ] }) })
                    ]
                  },
                  String(s.id)
                );
              }) })
            ] })
          }
        ) })
      ] })
    ] }) }),
    viewCard && /* @__PURE__ */ jsxRuntimeExports.jsx(StaffIDCard, { staff: viewCard, onClose: () => setViewCard(null) }),
    setPwStaff && /* @__PURE__ */ jsxRuntimeExports.jsx(SetPasswordDialog, { staff: setPwStaff, onClose: handleSetPwClose }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Dialog,
      {
        open: showAdd,
        onOpenChange: (open) => {
          if (!saving) setShowAdd(open);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: editStaff ? "Edit Staff" : "Add New Staff" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.name,
                    onChange: (e) => setForm({ ...form, name: e.target.value }),
                    "data-ocid": "staff.name.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "select",
                  {
                    className: "w-full border border-gray-200 rounded-md px-3 py-2 text-sm",
                    value: form.role,
                    onChange: (e) => setForm({ ...form, role: e.target.value }),
                    children: ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r.value, children: r.label }, r.value))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Phone *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.phone,
                    onChange: (e) => setForm({ ...form, phone: e.target.value }),
                    "data-ocid": "staff.phone.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Email" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.email,
                    onChange: (e) => setForm({ ...form, email: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Department" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: form.department,
                    onChange: (e) => setForm({ ...form, department: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Join Date" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "date",
                    value: form.joinDate,
                    onChange: (e) => setForm({ ...form, joinDate: e.target.value })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-gray-600 mb-0.5", children: "Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: form.address,
                  onChange: (e) => setForm({ ...form, address: e.target.value })
                }
              )
            ] })
          ] }),
          formError && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-red-600 bg-red-50 rounded px-2 py-1 mt-2",
              "data-ocid": "staff.form.error_state",
              children: formError
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                onClick: () => setShowAdd(false),
                disabled: saving,
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "bg-[#1F7E78] hover:bg-[#166661] text-white",
                onClick: save,
                disabled: saving,
                "data-ocid": "staff.form.submit_button",
                children: saving ? "Saving..." : "Save"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  StaffPage as default
};
