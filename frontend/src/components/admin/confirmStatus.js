import Swal from "sweetalert2";
import { statusLabel, STATUS_STYLE } from "./orderStatus";

/**
 * Admin-কে জিজ্ঞেস করে। Yes চাপলে true, Cancel/বাইরে চাপলে false।
 */
export const confirmStatusChange = async (orderId, fromStatus, toStatus) => {
  const to = STATUS_STYLE[toStatus] || STATUS_STYLE.pending;

  const result = await Swal.fire({
    title: "Change order status?",
    html: `
            <div style="font-family: inherit; font-size: 14px; line-height: 1.7;">
                Order <b>#${orderId}</b><br/>
                <span style="opacity:.7">${statusLabel(fromStatus)}</span>
                &nbsp;→&nbsp;
                <b style="color:${to.color}">${statusLabel(toStatus)}</b>
            </div>
        `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, change it",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#F5A623",
    cancelButtonColor: "#94A0A0",
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
};

export const toastSuccess = (text) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: text,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });

export const toastError = (text) =>
  Swal.fire({
    icon: "error",
    title: "Could not change status",
    text,
    confirmButtonColor: "#F5A623",
  });
