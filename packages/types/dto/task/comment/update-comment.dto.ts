import { PartialType, PickType } from "@nestjs/mapped-types";
import { CommentDTO } from "./comment.dto";
export class UpdateCommentDTO extends PartialType(CommentDTO) {}
