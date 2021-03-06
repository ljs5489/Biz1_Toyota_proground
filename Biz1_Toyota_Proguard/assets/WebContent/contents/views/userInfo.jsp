<%@ page language="java" contentType="text/html; charset=EUC-KR"
	pageEncoding="EUC-KR"%>
<!DOCTYPE html>
<html lang="ko">
<head>



<%@include file="../include/header.jsp"%>


</head>

<body>
	<div data-role="page" id="sub_wrap">
		<div data-role="content" id="sub_content">
			<ul class="my_info f_mt">
				<li class="info01 tab on" value="1">
					<!-- on off --> <span>기본정보</span>
				</li>
				<li class="info02 tab off" value="2"><span>비밀번호변경</span></li>
			</ul>
			<div class="info_wrap1" id="form1">
				<!-- 개인정보 수정 -->
				<div class="info_div">
					<table width="100%" class="board_tb" id="userContent">
						<colgroup>
							<col width="40%">
							<col width="60%">
						</colgroup>
						<tbody class="tb_ok">
							<tr>
								<th scope="row" class="tb_rd">ID</th>
								<td id="userId"></td>
							</tr>
							<!--
				<tr>
				<th scope="row">Password</th>
				<td id="userPwd"></td>
				</tr>
				-->
							<tr>
								<th scope="row">성명</th>
								<td id="userName"></td>
							</tr>
							<tr>
								<th scope="row">생년월일</th>
								<td id="userBirth"></td>
							</tr>
							<tr id="userEmailContent">
								<th scope="row">이메일주소</th>
								<td id="userEmail"></td>
							</tr>
							<tr id="userEmailModifyContent" style="display: none;">
								<th scope="row">이메일주소</th>
								<td><input type="email" name="" id="inp_email" style=""></td>
							</tr>
							<tr>
								<th scope="row" class="tb_rdl">소속딜러정보</th>
								<td id="userDealer"></td>
							</tr>
						</tbody>
					</table>
				</div>
				<p class="clear ov_h" style="margin-top: 1em;">
					<a class="save_btn fl_r" id="btn_userModify">수 정</a> <a
						class="save_btn fl_r" id="btn_userSave" style="display: none;">저
						장</a>
				</p>
			</div>

			<div class="info_wrap1" id="form2" style="display: none;">
				<!-- 개인정보 수정 -->
				<!-- <form action="" method="" name=""> -->
				<div class="info_div">
					<div class="inner_con">
						<ul class="text_list">
							<li>영문자, 숫자 8자리 이상이어야 합니다.</li>
							<li>영문자, 특수문자 8자리 이상이어야 합니다.</li>
							<li>비밀번호 유효일자는 90일입니다.</li>
							<!-- <li>8(8)자 이상 15(15)자 이하이어야 합니다.</li>
						<li>최소 하나의 영문자(a-z; A-Z)를 포함해야 합니다.</li>
						<li>최소 하나의 숫자(0-9)를 포함해야 합니다.</li>
						<li>최소 하나의 특수 문자를 포함해야 합니다. </li>
						<li>예를 들면 다음과 같습니다. @&%”.</li> -->
						</ul>
					</div>
					<table width="100%" class="board_tb mt_18 mb_30" id="pwdContent">
						<colgroup>
							<col width="40%">
							<col width="60%">
						</colgroup>
						<tbody class="tb_ok">
							<tr class="bg_g">
								<th scope="row" class="tb_rd">신규비밀번호</th>
								<td class="tb_rd"><input type="password" name=""
									id="inp_newPwd1"></td>
							</tr>
							<tr class="bg_g">
								<th scope="row" class="tb_rdl">비밀번호확인</th>
								<td class="tb_rdl"><input type="password" name=""
									id="inp_newPwd2"></td>
							</tr>
						</tbody>
					</table>
				</div>
				<p class="clear ov_h" style="margin-top: 1em;">
					<a class="save_btn fl_r" id="btn_pwdModify">수 정</a>
				</p>
				<!-- </form> -->
			</div>
		</div>
		<!-- /content -->

	</div>
	<!-- /page -->

</body>
</html>
tml>
