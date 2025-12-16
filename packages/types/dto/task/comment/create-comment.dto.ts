import { PickType } from "@nestjs/mapped-types";
import { CommentDTO } from "./comment.dto";
export class 

CreateCommentDTO extends PickType(CommentDTO, [
  "comment",
]) {}
